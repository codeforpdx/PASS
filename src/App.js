import { useSession } from "./hooks";
import { createContext } from "react";
import Login from "./components/Login/Login";
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
} from "./components/Form";
import CrossPodQuery from "./components/Form/CrossPodQuery";
import CrossPodWrite from "./components/Form/CrossPodWrite";

const AppHeader = () => {
  return (
    <header>
      <h2>Getting Started with PASS</h2>
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
        <CrossPodQuery />
        <CrossPodWrite />
      </SessionContext.Provider>
    </>
  );
};

export default App;
