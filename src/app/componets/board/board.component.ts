import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { boardModel } from './board.model';

import { Renderer2 } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { updateBoardModel } from './update.board.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { colabModel } from './colab.model';
import { updateColabModel } from './update.colab.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  @ViewChild(MatMenuTrigger)
  trigger!: MatMenuTrigger;

  someMethod() {
    this.trigger.openMenu();
  }

  memberForm!: FormGroup;
  boardForm!: FormGroup;
  boardName: string = '';

  // model object
  boardModelObj: boardModel = new boardModel();
  updateBoardModelObj: updateBoardModel = new updateBoardModel();
  colabModelObj: colabModel = new colabModel();
  updateColabModelObj: updateColabModel = new updateColabModel();

  ownedBoardData!: any;
  collabBoardData!: any;
  showAdd!: boolean;
  showUpdate!: boolean;
  selectedBoardId: number | null = null;
  username?: string;
  users!: any;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private renderer: Renderer2,
    private cookies: CookieService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.boardForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.memberForm = this.fb.group({
      user_id: ['', Validators.required],
    });
    let temp: any[] = [];
    this.api.getUsers().subscribe((res) => {
      // temp.push(res);
      this.users = res;
      console.log(this.users);
    });
    // this.users = temp;

    this.getAllBoard();
    this.username = this.cookies.get('user-name');
    this.route.params.subscribe((params) => {
      this.selectedBoardId = params['id'];
    });

    this.loadExternalScript('/src/assets/js/script.js');
  }

  // Start Board Logic
  postBoardDetails() {
    this.showAdd = true;
    this.showUpdate = false;
    this.boardModelObj.name = this.boardForm.value.name;
    this.boardModelObj.created_by = parseInt(this.cookies.get('user-id'));

    this.api.postBoard(this.boardModelObj).subscribe(
      (res) => {
        console.log(res);
        // alert('Board added succesfully!');
        this._snackBar.open('Board Added Successfully!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
        let ref = document.getElementById('cancel');
        ref?.click();
        this.boardForm.reset();
        this.getAllBoard();
      },
      (error) => {
        // alert('Something went wrong!');
        this._snackBar.open('Something Went Wrong!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    );
  }

  selectList(boardId: number) {
    this.selectedBoardId = boardId;
    this.getListData(boardId); // Perbarui konten list sesuai dengan board yang dipilih
  }

  getListData(boardId: number) {
    // Panggil API atau logika Anda untuk mendapatkan data list berdasarkan boardId
    // Misalnya, Anda dapat mengubah listData sesuai dengan data yang diterima dari API
    // this.listData = ...
    this.api.getList().subscribe((res: any) => {
      this.selectedBoardId = res;
      console.log(res);
    });
  }

  getAllBoard() {
    let userId = this.cookies.get('user-id');
    this.api.getBoard(+userId).subscribe((res) => {
      this.ownedBoardData = res.owned;
      this.collabBoardData = res.collab;
      console.log(this.ownedBoardData, this.collabBoardData);
    });
  }

  onEdit(row: any) {
    this.boardModelObj.id = row.id;
    this.boardForm.controls['name'].setValue(row.name);
    // this.boardModelObj.created_by = parseInt(this.cookies.get('user-id'));
  }

  updateBoardDetails() {
    this.showAdd = false;
    this.showUpdate = true;
    // console.log();
    // this.boardModelObj.id = this.boardForm.value.id;
    this.updateBoardModelObj.name = this.boardForm.value.name;

    this.api
      .updateBoard(this.updateBoardModelObj, this.boardModelObj.id)
      .subscribe(
        (res) => {
          console.log(res);
          // alert('Board updated successfully!');
          this._snackBar.open('Board Update Successfully!', '', {
            duration: 4000,
            verticalPosition: 'top',
          });
          let ref = document.getElementById('cancel');
          ref?.click();
          this.boardForm.reset();
          this.getAllBoard();
        },
        (error) => {
          console.error('Error updating board:', error);
          // alert('Something went wrong!');
          this._snackBar.open('Something Went Wrong!', '', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      );
  }

  clickAddBoard() {
    this.boardForm.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  deleteBoard(row: any) {
    this.api.deleteBoard(row.id).subscribe(
      (res) => {
        // alert('Board Deleted!');
        this._snackBar.open('Board Deleted Successfully!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
        this.getAllBoard(); // Refresh the task list after deletion
      },
      (error) => {
        console.error('Error deleting board:', error);
        // Handle error accordingly (show error message, log, etc.)
        this._snackBar.open('Error Deleting board!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    );
  }

  addColabBoard(row: any) {
    this.colabModelObj.board_id = row.id;
  }
  // End Board Logic

  // Logout
  logout() {
    this.cookies.delete('access-token');
    this.cookies.delete('refresh-token');
    this.cookies.delete('user-id');
    this.cookies.delete('user-email');
    this.cookies.delete('user-name');
    this.router.navigate(['/home']);
    this._snackBar.open('Logout Successfully!', '', {
      duration: 2000,
      verticalPosition: 'top',
    });
  }

  goToKanbanPage(row: any) {
    // Navigasi ke halaman kanban dengan id dari row
    this.router.navigate(['/kanban', row.id]);
  }

  private loadExternalScript(scriptUrl: string): HTMLScriptElement {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptUrl;
    this.renderer.appendChild(document.body, script);
    return script;
  }

  toggleSidebar(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('bx-menu')) {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.classList.toggle('hide');
      }
    }
  }

  toggleDarkMode(event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  addCollaborator() {
    this.colabModelObj.user_id = +this.memberForm.value.user_id;

    this.api.addColab(this.colabModelObj).subscribe(
      (res) => {
        console.log(res);
        // alert('Board added succesfully!');
        this._snackBar.open('Member Added Successfully!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
        let ref = document.getElementById('cancel');
        ref?.click();
        this.memberForm.reset();
        this.getAllBoard();
      },
      (error) => {
        // alert('Something went wrong!');
        this._snackBar.open('Something Went Wrong!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    );
  }
}
