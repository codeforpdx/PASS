import { SessionProvider } from "@inrupt/solid-ui-react";
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
    <nav className="teal darken-3" role="navigation">
      <div className="nav-wrapper container">
        <h4>Getting Started with PASS</h4>
      </div>
    </nav>
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
