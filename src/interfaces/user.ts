export interface User {
  id:string;
  name:string;
  email:string;
  creationDate:Date;
  password?:string; //optional field
}