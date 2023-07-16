import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { FunctionalityList } from "./FunctionalityList";
import { FunctionalityTasksList } from "./FunctionalityTaskList";
import { useState } from "react";
import { Login } from "./Login";

export default function App() {
  const [token, setToken] = useState<string | null>(
    window.localStorage.getItem("token")
  );
  const [email, setEmail] = useState<string | null>(
    window.localStorage.getItem("email")
  );

  const logout = () => {
    setToken(null);
    setEmail(null);
    window.localStorage.removeItem("token");

    window.localStorage.removeItem("email");
  };
  const auth = {
    token,
    email,
    logout,
  };
  return (
    <Router>
      <div>
        <Routes>
          {token ? (
            <>
              <Route path="/" element={<FunctionalityList auth={auth} />} />

              <Route
                path="/functionalities/:funcId"
                element={<FunctionalityTasksList auth={auth} />}
              />
            </>
          ) : (
            <Route
              path="*"
              element={
                <Login
                  onLogin={(auth) => {
                    setToken(auth.token);
                    setEmail(auth.email);
                    window.localStorage.setItem("token", auth.token);
                    window.localStorage.setItem("email", auth.email);
                  }}
                />
              }
            />
          )}
        </Routes>
      </div>
    </Router>
  );
}
