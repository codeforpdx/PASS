import { SessionProvider } from "@inrupt/solid-ui-react";
import Login from "./components/Login/Login";
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQuery,
  CrossPodWrite,
} from "./components/Form";

const AppHeader = () => {
  return (
    <header>
      <h2>Getting Started with PASS</h2>
    </header>
  );
};

const App = () => {
  return (
    <>
      <AppHeader />
      <SessionProvider>
        <main>
          <Login />
          <UploadDocumentForm />
          <FetchDocumentForm />
          <DeleteDocumentForm />
          <CrossPodQuery />
          <CrossPodWrite />
        </main>
      </SessionProvider>
    </>
  );
};

export default App;
