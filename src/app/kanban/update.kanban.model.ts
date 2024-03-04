export class updateListModel {
  name: string = '';
}

export class updateTaskModel {
  title?: string;
  description?: string;
  due_date: Date | any;
  list_id?: number;
}
