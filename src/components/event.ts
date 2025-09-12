import type { ProcessedEvent } from "@aldabil/react-scheduler/types";

export const EVENTS: ProcessedEvent[] = [
  {
    event_id: 1,
    title: "Event 1",
    description:"djhasdjhasd",
    start: new Date(new Date(new Date().setHours(9)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    disabled: true,
    admin_id: [1, 2, 3, 4],
    priority: "high",
    Category:'abc'
  },
  {
    event_id: 2,
    title: "Event 2",
    description:"djhasdjhasd",
    start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
    admin_id: 2,
    color: "#50b500",
    priority: "medium",
    Category:'abc'
  },
  {
    event_id: 3,
    title: "Event 3",
    description:"djhasdjhasd",
    start: new Date(new Date(new Date().setHours(11)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
    admin_id: 1,
    editable: false,
    deletable: false,
    priority: "low",
    Category:'abc'
  },
  {
    event_id: 4,
    title: "Event 4",
    description:"djhasdjhasd",
    start: new Date(
      new Date(new Date(new Date().setHours(9)).setMinutes(30)).setDate(
        new Date().getDate() - 2
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
        new Date().getDate() - 2
      )
    ),
    admin_id: 2,
    color: "#900000",
    priority: "high",
    Category:'abc'
  },
  {
    event_id: 5,
    title: "Event 5",
    description:"djhasdjhasd",
    start: new Date(
      new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
        new Date().getDate() - 2
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
        new Date().getDate() - 2
      )
    ),
    admin_id: 2,
    editable: true,
    priority: "medium"
  },
  {
    event_id: 6,
    title: "Event 6",
    description:"djhasdjhasd",
    start: new Date(
      new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
        new Date().getDate() - 4
      )
    ),
    end: new Date(new Date(new Date().setHours(14)).setMinutes(0)),
    admin_id: 2,
    priority: "low"
  }
];
