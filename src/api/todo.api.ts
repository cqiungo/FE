// src/services/todoService.ts
const API_URL = "http://localhost:3000";

export type TodoDto = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  end: Date;
  start:Date;
  completed:boolean
  image?: string; // BE sẽ override nếu có file upload
};

// 🟢 Thêm todo không có file (JSON)
export async function add(userId: string, todo: TodoDto) {
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

export async function remove(userId: string) {
  console.log(userId)
  const res = await fetch(`${API_URL}/todo/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to add todo: ${msg}`);
  }

  return await res.json();
}