import { Component, OnInit, Renderer2 } from '@angular/core';
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

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent {
  // form
  kanbanForm!: FormGroup;

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

  constructor(
    // private ucok: formatDat,
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private renderer: Renderer2,
    private cookies: CookieService,
    private route: ActivatedRoute
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

    this.route.params.subscribe((params) => {
      this.boardId = params['id'];
    });
    this.getAllList();
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
        alert('Task Error!');
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
        this.createInitialTask(res.id);

        alert('Post Added Succesfully!');

        let ref = document.getElementById('cancel');
        ref?.click();
        this.kanbanForm.reset();
        this.getAllList();
        // this.showTaskList = false;
      },
      (error) => {
        alert('Something Error!');
      }
    );
  }

  async getAllList() {
    return this.api.getBoardById(this.boardId).subscribe((res: any) => {
      this.listData = res.lists;
      this.listData.forEach((val: any) => {
        console.log(val.tasks.length);
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
    console.log();
    this.updateListModelObj.name = this.kanbanForm.value.name;
    this.api
      .updateList(this.updateListModelObj, this.listModelObj.id)
      .subscribe(
        (res) => {
          console.log(res);
          alert('List updated successfully!');
          let ref = document.getElementById('cancel');
          ref?.click();
          this.kanbanForm.reset();
          this.getAllList();
        },
        (error) => {
          console.error('Error updating list:', error);
          alert('Something went wrong!');
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
        alert('List Deleted!');
        this.getAllList();
      },
      (error) => {
        console.error('Error deleting list:', error);
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
        alert('Task added successfully!');
        let ref = document.getElementById('cancel');
        ref?.click();
        this.kanbanForm.reset();
        this.getAllList();
      },
      (error) => {
        alert('Task Error!');
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
          alert('Task updated successfully!');
          let ref = document.getElementById('cancel');
          ref?.click();
          this.kanbanForm.reset();
          this.getAllList();
        },
        (error) => {
          console.error('Error updating task:', error);
          alert('Something went wrong!');
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
        alert('Task Deleted!');
        this.getAllList();
      },
      (error) => {
        console.error('Error deleting task:', error);
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
          let ref = document.getElementById('cancel');
          ref?.click();
          this.kanbanForm.reset();
          this.getAllList();
        },
        (error) => {
          console.error('Error updating task:', error);
          alert('Something went wrong!');
        }
      );
    }
  }
}
