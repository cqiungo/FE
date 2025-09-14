import axiosClient from "./axiosClient";
export const userApi = {
  getToDolistByUser: async (id: string) => {
    const res = await axiosClient.get(`/user/${id}`);
    return res.data;
  },

  createTodo: (data: any,id:string)=>{
    axiosClient.post("/user"+`/${id}`, data)
  }
    
};
