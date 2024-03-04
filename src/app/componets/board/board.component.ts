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

  boardForm!: FormGroup;
  boardName: string = '';
  boardModelObj: boardModel = new boardModel();
  updateBoardModelObj: updateBoardModel = new updateBoardModel();
  boardData!: any;
  showAdd!: boolean;
  showUpdate!: boolean;
  selectedBoardId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private renderer: Renderer2,
    private cookies: CookieService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.boardForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.getAllBoard();
    this.route.params.subscribe((params) => {
      this.selectedBoardId = params['id'];
    });
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
        alert('Board added succesfully!');
        let ref = document.getElementById('cancel');
        ref?.click();
        this.boardForm.reset();
        this.getAllBoard();
      },
      (error) => {
        alert('Something went wrong!');
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
      this.boardData = res;
      console.log(res);
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
          alert('Board updated successfully!');
          let ref = document.getElementById('cancel');
          ref?.click();
          this.boardForm.reset();
          this.getAllBoard();
        },
        (error) => {
          console.error('Error updating board:', error);
          alert('Something went wrong!');
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
        alert('Board Deleted!');
        this.getAllBoard(); // Refresh the task list after deletion
      },
      (error) => {
        console.error('Error deleting board:', error);
        // Handle error accordingly (show error message, log, etc.)
      }
    );
  }

  // End Board Logic

  // Logout
  logout() {
    this.cookies.delete('access-token');
    this.cookies.delete('refresh-token');
    this.cookies.delete('user-id');
    this.cookies.delete('user-email');
    this.cookies.delete('user-name');
    this.router.navigate(['/login']);
  }

  // Extra JS
  private loadExternalScript(scriptUrl: string): HTMLScriptElement {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptUrl;
    this.renderer.appendChild(document.body, script);
    return script;
  }

  goToKanbanPage(row: any) {
    // Navigasi ke halaman kanban dengan id dari row
    this.router.navigate(['/kanban', row.id]);
  }
}
