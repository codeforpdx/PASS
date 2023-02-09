import { useSession } from "./hooks";
import { createContext } from "react";
import Login from "./components/Login/Login";
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
} from "./components/Form";

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
        <UploadDocumentForm />
        <FetchDocumentForm />
        <DeleteDocumentForm />
      </SessionContext.Provider>
    </>
  );
};

export default App;
