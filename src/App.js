import Login from "./components/Login/Login";
import WriteForm from "./components/Form/WriteForm";
import { useSession } from "./hooks";
import { createContext, useState } from "react";

const AppHeader = () => {
  return (
    <header>
      <h2>Getting Started</h2>
      <h3>with Inrupt JavaScript Client Libraries</h3>
    </header>
  );
};

export const SessionContext = createContext(null);

const App = () => {
  const { session, setSession, handleLogin } = useSession();
  const [_update, setUpdate] = useState(false);

  return (
    <>
      <AppHeader />
      <SessionContext.Provider value={{ session, setSession, handleLogin }}>
        <Login setUpdate={setUpdate} />
        <WriteForm />
        {/* <div hidden={!session.info.isLoggedIn ? "" : ""} className="panel"> toggle hidden off when testing inputs */}
        <div hidden={!session.info.isLoggedIn ? "hidden" : ""} className="panel">
          <div className="row">
            <div>Current Documents</div>
          </div>
        </div>
        {/* <div hidden={!session.info.isLoggedIn ? "" : ""} className="panel"> toggle hidden off when testing inputs */}
        <div hidden={!session.info.isLoggedIn ? "hidden" : ""} className="panel">
          <div className="row">
            <form>
              <label>Query Documents</label>
            </form>
          </div>
        </div>
      </SessionContext.Provider>
    </>
  );
};

export default App;
