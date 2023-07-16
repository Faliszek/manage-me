import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch, { CachePolicies } from "use-http";
import { SERVER_URL } from "./env";
import { Auth, FunctionalityWithTasks, Task } from "./types";
import { Page } from "./Page";
import { AddForm } from "./AddForm";
import { SingleListElement } from "./SingleListElement";

export function FunctionalityTasksList(props: { auth: Auth }) {
  const { funcId } = useParams<{ funcId: string }>();
  const fId = funcId as string;
  const { get, del } = useFetch(`${SERVER_URL}/functionalities`, {
    cachePolicy: CachePolicies.NETWORK_ONLY,
  });
  const { post, loading } = useFetch(`${SERVER_URL}/functionalities`);
  const { put } = useFetch(`${SERVER_URL}/functionalities`);
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [data, setData] = useState<FunctionalityWithTasks | null>(null);
  const tasks = useMemo(() => data?.tasks ?? [], [data]);

  async function addTask() {
    const task = (await post(`${fId}/tasks`, {
      title: newTaskName,
      status: "TODO",
    })) as Task;

    if (task) {
      setData((data) => {
        const currentTasks = data?.tasks ?? [];
        if (data) {
          return {
            ...data,
            tasks: currentTasks.concat(task),
          };
        }
        return null;
      });
    }

    setNewTaskName("");
  }

  async function removeTask(taskId: string) {
    const deletedTask = (await del(`${fId}/tasks/${taskId}`)) as Task;
    if (deletedTask?._id) {
      setData((data) => {
        const currentTasks = data?.tasks ?? [];
        if (data) {
          return {
            ...data,
            tasks: currentTasks.filter((t) => t._id !== deletedTask._id),
          };
        }
        return null;
      });
    }
  }

  async function updateTask(
    taskId: string,
    params: { name?: string; status?: string }
  ) {
    const updatedTask = (await put(`${fId}/tasks/${taskId}`, {
      title: params.name,
      status: params.status,
    })) as Task;

    if (updatedTask?._id) {
      setData((data) => {
        const currentTasks = data?.tasks ?? [];
        if (data) {
          return {
            ...data,
            tasks: currentTasks.map((t) => {
              if (t._id === updatedTask._id) {
                return updatedTask;
              } else {
                return t;
              }
            }),
          };
        }
        return null;
      });
    }
  }

  useEffect(() => {
    const loadTasks = async () => {
      const data = (await get(`/${fId}/tasks`)) as FunctionalityWithTasks;
      setData(data);
    };

    void loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const todo = useMemo(() => tasks.filter((t) => t.status === "TODO"), [tasks]);
  const doing = useMemo(
    () => tasks.filter((t) => t.status === "DOING"),
    [tasks]
  );
  const done = useMemo(() => tasks.filter((t) => t.status === "DONE"), [tasks]);

  console.log({ todo, doing });
  return (
    <Page
      auth={props.auth}
      title={
        <>
          Tasks for functionality: <b>{data?.title}</b>
        </>
      }
    >
      <AddForm
        onSubmit={addTask}
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
        loading={loading}
      />

      {todo.length > 0 ? (
        <div className="flex flex-col gap-4 py-4">
          <h1 className="text-zinc-600 text-xl">TODO</h1>
          {todo.map((t) => {
            return (
              <SingleListElement
                key={t._id}
                title={t.title}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onClick={() => {}}
                onRemove={() => void removeTask(t._id)}
                onSave={(name) => void updateTask(t._id, { name })}
                onUpdateStatus={(status) => void updateTask(t._id, { status })}
                status={t.status}
              />
            );
          })}
        </div>
      ) : null}

      {doing.length > 0 ? (
        <div className="flex flex-col gap-4 py-4">
          <h1 className="text-zinc-600 text-xl">Doing</h1>
          {doing.map((t) => {
            return (
              <SingleListElement
                key={t._id}
                title={t.title}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onClick={() => {}}
                onRemove={() => void removeTask(t._id)}
                onSave={(name) => void updateTask(t._id, { name })}
                onUpdateStatus={(status) => void updateTask(t._id, { status })}
                status={t.status}
              />
            );
          })}
        </div>
      ) : null}

      {done.length > 0 ? (
        <div className="flex flex-col gap-4 py-4">
          <h1 className="text-zinc-600 text-xl">Done</h1>
          {done.map((t) => {
            return (
              <SingleListElement
                key={t._id}
                title={t.title}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onClick={() => {}}
                onRemove={() => void removeTask(t._id)}
                onSave={(name) => void updateTask(t._id, { name })}
                onUpdateStatus={(status) => void updateTask(t._id, { status })}
                status={t.status}
              />
            );
          })}
        </div>
      ) : null}
    </Page>
  );
}
