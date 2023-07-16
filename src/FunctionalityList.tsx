/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect, useState } from "react";
import useFetch, { CachePolicies } from "use-http";
import { SERVER_URL } from "./env";
import { useNavigate } from "react-router-dom";
import { Auth, Functionality } from "./types";
import { Page } from "./Page";
import { SingleListElement } from "./SingleListElement";
import { AddForm } from "./AddForm";

export function FunctionalityList(props: { auth: Auth }) {
  const navigate = useNavigate();

  const [newFuncName, setNewFuncName] = useState<string>("");
  const [functionalites, setFunctionalities] = useState<Functionality[]>([]);
  const { get, post, loading, put } = useFetch(`${SERVER_URL}`, {
    cachePolicy: CachePolicies.NETWORK_ONLY,
  });

  const { del } = useFetch(`${SERVER_URL}`);

  async function addFunctionality() {
    const data = (await post("/functionalities", {
      title: newFuncName,
    })) as Functionality;

    if (data) {
      setFunctionalities([...functionalites, data]);
      setNewFuncName("");
    }
  }

  async function removeFunctionality(funcId: string) {
    const data = (await del(`/functionalities/${funcId}`, {
      title: newFuncName,
    })) as Functionality;

    if (data) {
      setFunctionalities((data) =>
        data.filter((f: Functionality) => f._id !== funcId)
      );
    }
  }

  async function updateFunctionality(funcId: string, name: string) {
    const data = (await put(`/functionalities/${funcId}`, {
      title: name,
    })) as Functionality;

    if (data) {
      setFunctionalities((data) =>
        data.map((f: Functionality) => {
          if (f._id === funcId) {
            return {
              ...f,
              title: name,
            };
          } else {
            return f;
          }
        })
      );
    }
  }

  useEffect(() => {
    const loadInitialFunctionalities = async () => {
      const data = (await get("/functionalities")) as Functionality[];

      if (data) {
        setFunctionalities(data);
      }
    };

    loadInitialFunctionalities();
  }, [get]);

  return (
    <Page title="Functionality List" auth={props.auth}>
      <AddForm
        value={newFuncName}
        onChange={(e) => setNewFuncName(e.target.value)}
        onSubmit={() => addFunctionality()}
        loading={loading}
      />
      <div className="flex flex-col gap-4 py-4">
        {functionalites.map((f) => {
          return (
            <SingleListElement
              key={f._id}
              title={f.title}
              onClick={() => navigate(`/functionalities/${f._id}`)}
              onSave={(name) => void updateFunctionality(f._id, name)}
              onRemove={() => void removeFunctionality(f._id)}
            />
          );
        })}
      </div>
    </Page>
  );
}
