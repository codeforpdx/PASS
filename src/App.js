import { createContext, useEffect, useState } from "react";
import Login from "./components/Login/Login";
import WriteForm from "./components/Form/WriteForm";
import { Session } from "@inrupt/solid-client-authn-browser";
import { SOLID_IDENTITY_PROVIDER } from "./utils/session-helper";

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
  // Initialize state for Solid session
  const [session, setSession] = useState(new Session());
  // Force component rerenders for those dependent on session
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    handleRedirectAfterLogin();
    handleSession();
  }, [session]);

  // Solid login call for Pod
  async function loginPod() {
    if (!session.info.isLoggedIn) {
      await session.login({
        oidcIssuer: SOLID_IDENTITY_PROVIDER,
        redirectUrl: window.location.href,
      });
    }
  }
  // Solid redirect function for Pod
  async function handleRedirectAfterLogin() {
    await session.handleIncomingRedirect(window.location.href);
  }

  const handleLogin = () => {
    loginPod();
    console.log("logging in...");
  };

  const handleSession = () => {
    setSession((state) => {
      return state;
    });
  };

  return (
    <>
      <AppHeader />
      <SessionContext.Provider value={{ session, setSession }}>
        <Login handleLogin={handleLogin} handleRedirectAfterLogin={handleRedirectAfterLogin} setUpdate={setUpdate} update={update} />
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
