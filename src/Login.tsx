/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from "react";
import useFetch, { CachePolicies } from "use-http";
import { SERVER_URL } from "./env";

export function Login(props: {
  onLogin: (parans: { token: string; email: string }) => void;
}) {
  const [email, setEmail] = useState<string>("adam@adamczyk.com");
  const [password, setPassword] = useState<string>("zaq1@WSX");
  const { post, loading } = useFetch(`${SERVER_URL}`, {
    cachePolicy: CachePolicies.NETWORK_ONLY,
  });

  return (
    <div className="flex flex-col p-4 min-w-screen min-h-screen items-center justify-center">
      <form
        className="flex flex-col gap-4 border border-zinc-300 rounded-md max-w-sm p-4 w-1/3"
        onSubmit={async (e) => {
          e.preventDefault();
          const res = (await post("/login", {
            email,
            password,
          })) as { token: string | null };

          if (res?.token) {
            props.onLogin({ token: res.token, email: email });
          }
        }}
      >
        <h2 className="text-zinc-600 text-2xl">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-blue-400 p-2 rounded-xl"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-blue-400 p-2 rounded-xl"
        />
        <button
          className="bg-blue-400 px-4 py-2 rounded-xl text-white "
          type="submit"
        >
          {loading ? "Loading" : "Login"}
        </button>
      </form>
    </div>
  );
}
