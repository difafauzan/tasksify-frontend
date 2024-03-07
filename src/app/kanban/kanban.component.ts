import { Component, Injectable, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { listModel, taskModel } from './kanban.model';
import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
  transferArrayItem,
  // transferArrayItem,
} from '@angular/cdk/drag-drop';

import { ApiService } from '../shared/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { updateListModel, updateTaskModel } from './update.kanban.model';
import { map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { colabModel } from '../componets/board/colab.model';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent {
  // form
  kanbanForm!: FormGroup;
  memberForm!: any;

  // model
  listModelObj: listModel = new listModel();
  taskModelObj: taskModel = new taskModel();
  updateListModelObj: updateListModel = new updateListModel();
  updateTaskModelObj: updateTaskModel = new updateTaskModel();

  // form action
  public listData!: any;
  // todo: listModel[] = [];
  // inProgress: listModel[] = [];
  // done: listModel[] = [];
  // newList: string[] = [];

  // Action
  updateIndex: any;
  isEditEnabled: boolean = false;
  menuTrigger: any;
  row: any;
  showAdd!: boolean;
  showUpdate!: boolean;
  // showTaskList: boolean = false;
  boardName: any;
  navName: any;

  selectedListId: number | undefined;
  public listId!: number;
  private boardId: any;
  private positionId: any;
  task: any;
  username?: string;
  users!: any[];
  boardCreator!: any;
  notMemberUsers!: any[];
  colabModelObj: colabModel = new colabModel();

  constructor(
    // private ucok: formatDat,
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private renderer: Renderer2,
    private cookies: CookieService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.kanbanForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
    });
    this.memberForm = this.fb.group({
      user_id: ['', Validators.required],
      board_id: ['', Validators.required],
    });
    this.loadExternalScript('/src/assets/js/script.js');
    this.username = this.cookies.get('user-name');

    this.route.params.subscribe((params) => {
      this.boardId = params['id'];
    });
    this.getAllList();
    this.processNonMemberUser();
  }

  processNonMemberUser() {
    this.api.getUsers().subscribe((res: any) => {
      this.notMemberUsers = res;
    });
    // this.notMemberUsers = nonmember;
    // console.log(this.notMemberUsers);
  }

  createInitialTask(list_id: number) {
    this.taskModelObj.list_id = list_id;
    this.taskModelObj.title = 'Example Task 1';
    this.taskModelObj.description = 'Hello, this is task 1';
    this.taskModelObj.due_date = new Date('01/01/1970').toISOString();
    this.api.postTask(this.taskModelObj).subscribe(
      (res) => {
        let ref = document.getElementById('cancel');
        ref?.click();
        this.kanbanForm.reset();
        this.getAllList();
      },
      (error) => {
        this._snackBar.open('Task Error!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    );
  }

  // start list logic
  postList() {
    this.listModelObj.name = this.kanbanForm.value.name;
    this.listModelObj.position = 0;
    this.listModelObj.board_id = parseInt(this.boardId);

    this.api.postList(this.listModelObj).subscribe(
      (res) => {

        // alert('Post Added Succesfully!');
        this._snackBar.open('Post Added Successfully!.', '', {
          duration: 2000,
          verticalPosition: 'top',
        });

        let ref = document.getElementById('cancel');
        ref?.click();
        this.kanbanForm.reset();
        this.getAllList();
        // this.showTaskList = false;
      },
      (error) => {
        // alert('Something Error!');
        this._snackBar.open('Something went wrong!.', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    );
  }

  async getAllList() {
    return this.api.getBoardById(this.boardId).subscribe((res: any) => {
      this.boardCreator = res.creator;
      console.log(this.boardCreator)
      let temp = [];
      for (let n = 0; n < res.board_members.length; n++) {
        temp.push(res.board_members[n].user);
      }
      this.users = temp;
      // console.log(this.users);
      this.listData = res.lists;
      this.listData.forEach((val: any) => {
        if (val.tasks.length === 0) {
          val.tasks = [{ id: 0, title: 'This list is empty!', state: 'empty' }];
        }
      });
      // console.log(this.listData);
      this.boardName = res.name;
    });
  }

  onEditList(row: any) {
    this.listModelObj.id = row.id;
    this.kanbanForm.controls['name'].setValue(row.name);
    // this.boardModelObj.created_by = parseInt(this.cookies.get('user-id'));
  }

  updateList() {
    this.showAdd = false;
    this.showUpdate = true;
    this.updateListModelObj.name = this.kanbanForm.value.name;
    this.api
      .updateList(this.updateListModelObj, this.listModelObj.id)
      .subscribe(
        (res) => {
          console.log(res);
          // alert('List updated successfully!');
          this._snackBar.open('List Added Succesfully!.', '', {
            duration: 2000,
            verticalPosition: 'top',
          });
          let ref = document.getElementById('cancel');
          ref?.click();
          this.kanbanForm.reset();
          this.getAllList();
        },
        (error) => {
          // console.error('Error updating list:', error);
          // alert('Something went wrong!');
          this._snackBar.open('Something went Wrong!.', '', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      );
  }

  clickAddList() {
    this.kanbanForm.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  deleteList(list: any) {
    this.api.deleteList(list.id).subscribe(
      (res) => {
        // alert('List Deleted!');
        this._snackBar.open('List Deleted!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
        this.getAllList();
      },
      (error) => {
        console.error('Error deleting list:', error);
        this._snackBar.open('Error deleting list!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    );
  }
  // end list logic

  setSelected(id: number) {
    this.selectedListId = id;
  }

  // start task logic
  postTask() {
    console.log(this.selectedListId);
    this.taskModelObj.title = this.kanbanForm.value.title;
    this.taskModelObj.due_date = new Date(
      this.kanbanForm.value.due_date
    ).toISOString();
    this.taskModelObj.description = this.kanbanForm.value.description;
    if (this.selectedListId !== undefined) {
      this.taskModelObj.list_id = this.selectedListId;
    } else {
      console.error('selectedListId is undefined!');
      // Handle kasus ketika selectedListId adalah undefined, misalnya dengan menampilkan pesan kesalahan kepada pengguna
    }
    this.api.postTask(this.taskModelObj).subscribe(
      (res) => {
        console.log(res);
        // alert('Task added successfully!');
        this._snackBar.open('Task Added Successfully!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
        let ref = document.getElementById('cancel');
        ref?.click();
        this.kanbanForm.reset();
        this.getAllList();
      },
      (error) => {
        // alert('Task Error!');
        this._snackBar.open('Task Error!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    );
  }

  onEditTask(task: any) {
    this.taskModelObj.id = task.id;
    // alert(task.id);
    this.kanbanForm.controls['title'].setValue(task.title);
    this.kanbanForm.controls['due_date'].setValue(task.due_date);
    this.kanbanForm.controls['description'].setValue(task.description);
    // this.taskModelObj.list_id = this.listId;
  }

  updateTask() {
    this.showAdd = false;
    this.showUpdate = true;
    console.log();
    // this.updateTaskModelObj.due_date = this.kanbanForm.value.due_date;
    this.updateTaskModelObj.title = this.kanbanForm.value.title;
    this.updateTaskModelObj.due_date = new Date(
      this.kanbanForm.value.due_date
    ).toISOString();

    this.updateTaskModelObj.description = this.kanbanForm.value.description;
    this.api
      .updateTask(this.updateTaskModelObj, this.taskModelObj.id)
      .subscribe(
        (res) => {
          console.log(res);
          // alert('Task updated successfully!');
          this._snackBar.open('Task Update Successfully!.', '', {
            duration: 2000,
            verticalPosition: 'top',
          });
          let ref = document.getElementById('cancel');
          ref?.click();
          this.kanbanForm.reset();
          this.getAllList();
        },
        (error) => {
          console.error('Error updating task:', error);
          // alert('Something went wrong!');
          this._snackBar.open('Error Updating Task!', '', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      );
  }

  clickAddTask() {
    this.kanbanForm.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  deleteTask(task: any) {
    this.api.deleteTask(task.id).subscribe(
      (res) => {
        // alert('Task Deleted!');
        this._snackBar.open('Task Deleted Successfully!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
        this.getAllList();
      },
      (error) => {
        console.error('Error deleting task:', error);
        this._snackBar.open('Error Deleting Task!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    );
  }
  // end task logic

  logout() {
    this.cookies.delete('access-token');
    this.cookies.delete('refresh-token');
    this.cookies.delete('user-id');
    this.cookies.delete('user-email');
    this.cookies.delete('user-name');
    this.router.navigate(['/login']);
    this._snackBar.open('Logout Successfully!.', '', {
      duration: 2000,
      verticalPosition: 'top',
    });
  }

  drop(event: CdkDragDrop<string[]>, list_id: number) {
    // const temp = event.container.data;
    // console.log(event.container.data.filter((tem) => tem));
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateTaskModelObj.list_id = list_id;
      let temp = event.container.data[event.currentIndex];
      let taskID = temp['id' as keyof typeof temp];
      this.api.updateTask(this.updateTaskModelObj, taskID).subscribe(
        (res) => {
          console.log(res);
          this._snackBar.open('Task Update Successfully!', '', {
            duration: 2000,
            verticalPosition: 'top',
          });
          let ref = document.getElementById('cancel');
          ref?.click();
          this.kanbanForm.reset();
          this.getAllList();
        },
        (error) => {
          console.error('Error updating task:', error);
          // alert('Something went wrong!');
          this._snackBar.open('Error Updatating Task!', '', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      );
    }
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

  async addMember(){
    this.colabModelObj.user_id = +this.memberForm.value.user_id;
    this.colabModelObj.board_id = +this.boardId;
    this.api.addColab(this.colabModelObj).subscribe(
      (res) => {
        window.location.reload();
        // alert('Board added succesfully!');
        this._snackBar.open('Member Added Successfully!', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
        let ref = document.getElementById('cancel');
        ref?.click();
        this.memberForm.reset();
        this.getAllList();
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

  async removeMember(userId: number){
    this.colabModelObj.board_id = this.boardId;
    this.colabModelObj.user_id = userId;
    // console.log(this.colabModelObj)
    this.api.removeMember(this.colabModelObj).subscribe((res) => {
      window.location.reload();
    })
  }
}
