export interface Todo{
  id:number

  todo_id:string,

  title: string;

  description: string;

  completed: boolean;

  priority: Priority

  category: string

  image: string;

  start: Date;

  end: Date;

  actualTime: Date;
}
export type Priority = "high" | "medium" | "low";
