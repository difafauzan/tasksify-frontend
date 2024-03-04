export class listModel
{
  id?: number;
  name: string = '';
  position!: number;
  board_id!: number;
}

export class taskModel {
  id!: number;
  title: string = '';
  description: string = '';
  due_date: Date | any = 'MMM d, y, h:mm:ss a ';
  list_id!: number;
}
