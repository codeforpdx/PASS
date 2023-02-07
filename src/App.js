import Login from "./components/Login/Login";
import WriteForm from "./components/Form/WriteForm";
import { useSession } from "./hooks";
import { createContext } from "react";
import FetchDocumentForm from "./components/Form/FetchDocumentForm";

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
  const { session, handleLogin } = useSession();

  return (
    <>
      <AppHeader />
      <SessionContext.Provider value={{ session, handleLogin }}>
        <Login />
        <WriteForm />
        <FetchDocumentForm />
      </SessionContext.Provider>
    </>
  );
};

export default App;
