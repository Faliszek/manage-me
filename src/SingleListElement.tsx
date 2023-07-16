import { useEffect, useRef, useState } from "react";
import { Task } from "./types";

export function SingleListElement(props: {
  title: string;
  onClick: () => void;
  onSave: (name: string) => void;
  onRemove: () => void;
  onUpdateStatus?: (status: string) => void;
  status?: Task["status"] | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(props.title); // [state, setState
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <div
      className="flex py-2 bg-zinc-100 hover:bg-zinc-200 transition-colors justify-between rounded-md items-center h-12"
      onClick={() => props.onClick()}
    >
      <div className="px-4 flex gap-4">
        <div className="flex-1 items-center justify-between">
          {editing ? (
            <input
              type="text"
              value={title}
              ref={inputRef}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              className="px-4 py-2 rounded-xl bg-transparent w-20"
            />
          ) : (
            <div>{props.title}</div>
          )}
        </div>
        <div>
          {props.status ? (
            <select
              value={props.status}
              className="px-2 py-1 rounded-xl text-md text-zinc-600"
              onChange={(e) => {
                e.stopPropagation();
                props.onUpdateStatus?.(e.target.value);
              }}
            >
              <option value="TODO">TODO</option>
              <option value="DOING">DOING</option>
              <option value="DONE">DONE</option>
            </select>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2 p-4">
        {editing ? (
          <>
            <button
              className="bg-blue-400 px-4 py-1 rounded-xl text-white w-24"
              type="submit"
              onClick={(e) => {
                e.stopPropagation();
                props.onSave(title);
              }}
            >
              Save
            </button>
            <button
              className="bg-zinc-400 px-4 py-1 rounded-xl text-white  w-24"
              type="submit"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(false);
                setTitle(props.title);
              }}
            >
              Discard
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-blue-400 px-4 py-1 rounded-xl text-white w-24 "
              type="submit"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
            >
              Edit
            </button>

            <button
              className="bg-red-400 px-4 py-1 rounded-xl text-white w-24"
              type="submit"
              onClick={(e) => {
                e.stopPropagation();
                props.onRemove();
              }}
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
}
