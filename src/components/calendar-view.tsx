import { Scheduler } from "@aldabil/react-scheduler";
import type { EventActions, ProcessedEvent } from "@aldabil/react-scheduler/types";
import { useAuthContext } from "@/context/authContext";
import { update, remove, add } from "@/api/todo.api";

export default function MyCalendar() {
  const { user } = useAuthContext();

  // ================= GET REMOTE EVENTS =================
  const fetchRemote = async (): Promise<ProcessedEvent[]> => {
    try {
      const res = await fetch(`https://be-3-vs4l.onrender.com/user/${user!.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      const fetchedTodos = data.todos || [];

      const EVENTS: ProcessedEvent[] = fetchedTodos.map((todo: any) => {
        let color = "";
        const now = new Date();
        const endDate = todo.end ? new Date(todo.end) : new Date();

        if (todo.completed) {
          color = "#00ff37ff"; // đã hoàn thành (xanh lá)
        } else if (endDate < now) {
          color = "#b5bfc27c"; // quá hạn (xám)
        } else {
          switch (todo.priority) {
            case "low":
              color = "#5cc4eedc"; // xanh lam
              break;
            case "medium":
              color = "#e3ff45ff"; // vàng
              break;
            case "high":
              color = "#FF0000"; // đỏ
              break;
            default:
              color = "blue"; // mặc định
          }
        }

        return {
          id: todo._id,
          event_id: todo._id,
          title: todo.title || "Untitled",
          subtitle: todo.description || "",
          description: todo.description,
          start: todo.start ? new Date(todo.start) : new Date(),
          end: todo.end ? new Date(todo.end) : new Date(),
          priority: todo.priority,
          category: todo.category,
          completed: todo.completed,
          color,
        };
      });

      console.log("Final EVENTS:", EVENTS);
      return EVENTS;
    } catch (err) {
      console.error("Error fetching events:", err);
      return [];
    }
  };

  // ================= CREATE / UPDATE EVENT =================
  const handleConfirm = async (
    event: ProcessedEvent,
    action: EventActions
  ): Promise<ProcessedEvent> => {
    try {
      const body = {
        title: event.title,
        description: event.description,
        end: event.end,
        priority: event.priority || "low",
        category: event.category || "Others",
        completed: event.completed,
        actualTime: null,
      };

      let savedEvent;

      if (action === "edit" && event.event_id) {
        console.log(event.event_id as string)
        savedEvent = await update(event.event_id as string, body);
      } else {
        savedEvent = await add(user!.id, body);
      }

      const newEvent: ProcessedEvent = {
        event_id:
          savedEvent.id?.toString() ||
          event.event_id ||
          Math.random().toString(),
        title: savedEvent.title || "Untitled",
        subtitle: savedEvent.description || "",
        description: savedEvent.description || "",
        start: savedEvent.start ? new Date(savedEvent.start) : new Date(),
        end: savedEvent.end ? new Date(savedEvent.end) : new Date(),
        color: savedEvent.color || "#5cc4eedc",
      };

      // 🔥 cập nhật state
      return newEvent;
    } catch (err) {
      console.error("Error saving event:", err);
      throw err;
    }
  };

  // ================= DELETE EVENT =================
  const handleDelete = async (event_id: string): Promise<string> => {
    try {
      await remove(event_id, user!.id);

      // 🔥 cập nhật state

      return event_id;
    } catch (err) {
      console.error("Error deleting event:", err);
      throw err;
    }
  };

  return (
    <Scheduler
      getRemoteEvents={fetchRemote}
      onConfirm={handleConfirm}
      onDelete={handleDelete}
    />
  );
}
