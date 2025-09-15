// src/services/todoService.ts
const API_URL = "https://be-3-vs4l.onrender.com";

export type TodoDto = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  end: Date;
  start:Date;
  completed:boolean
};

// 🟢 Thêm todo không có file (JSON)
export async function add(userId: string, todo: any) {
  const res = await fetch(`${API_URL}/user/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to add todo: ${msg}`);
  }

  return await res.json();
}

// 🟢 Thêm todo có file (multipart/form-data)
export async function addTodoWithFile(
  userId: string,
  todo: TodoDto,
  file: File
) {
  const formData = new FormData();

  // Đẩy file
  formData.append("file", file);

  // Đẩy các field JSON
    formData.append("file", file); // file ảnh
    formData.append("title", todo.title);
    formData.append("description", todo.description);
    formData.append("priority", todo.priority);
    formData.append("category", todo.category);
    formData.append("completed", String(todo.completed));
    formData.append("start", todo.start.toISOString());
    formData.append("end", todo.end.toISOString());

  const res = await fetch(`${API_URL}/user/${userId}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to add todo with file: ${msg}`);
  }

  return await res.json();
}

export async function remove(todoid:string,userId: string) {
  console.log("userID", userId)
  const res = await fetch(`${API_URL}/todo/${todoid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: userId }), 
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to delete todo: ${msg}`);
  }

  // Nếu server trả 204 thì không cần parse
  if (res.status === 204) return { success: true };

  // Nếu có body thì parse
  const text = await res.text();
  return text ? JSON.parse(text) : { success: true };

}
export async function update(id: string, todo: any) {
  console.log(id)
  const res = await fetch(`${API_URL}/todo/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to update todo: ${msg}`);
  }

  return await res.json();
}

