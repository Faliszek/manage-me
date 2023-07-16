import { Auth } from "./types";

export function Page(props: {
  title: string | React.ReactElement;
  auth: Auth;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      {props.auth ? (
        <nav className="p-4  bg-blue-300 flex justify-between items-center">
          <h2 className="text-white">
            Logged in as <b>{props.auth.email}</b>
          </h2>
          <button>
            <button
              className="bg-blue-400 px-4 py-1 rounded-xl text-white w-24 "
              type="button"
              onClick={() => {
                props.auth.logout();
              }}
            >
              Logout
            </button>
          </button>
        </nav>
      ) : null}
      <div className="p-4">
        <h1 className="text-3xl pb-8 text-zinc-600">{props.title}</h1>
        {props.children}
      </div>
    </div>
  );
}
