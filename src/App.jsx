import { SessionProvider } from "@inrupt/solid-ui-react";
import Login from "./components/Login/Login";
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQuery,
  CrossPodWrite,
} from "./components/Form";
import SetAclPermission from "./components/Form/SetAclPermission";

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
          <SetAclPermission />
          <CrossPodQuery />
          <CrossPodWrite />
        </main>
      </SessionProvider>
    </>
  );
};

export default App;
