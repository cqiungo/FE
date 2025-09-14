export interface LoginRequest {
  email: string;
  password: string;
}

export interface User{
  id:string,
  email:string,
  name:string,
  image:string,
  todo: string[],
}

export interface LoginResponse {
  user:User,
  access_token: string;
}

export interface RegisterRequest{
    name:string
    email:string,
    password:string,
    confirmPassword:string
}