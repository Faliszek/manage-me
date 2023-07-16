export type Functionality = {
  _id: string;
  title: string;
};

export type Task = {
  _id: string;
  title: string;
  status: "TODO" | "DOING" | "DONE";
};

export type FunctionalityWithTasks = Functionality & {
  tasks: Task[];
};

export type Auth = {
  token: string | null;
  email: string | null;
  logout: () => void;
};
