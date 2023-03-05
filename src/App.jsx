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
    <div className="col s12 m7">
      <nav className="teal darken-3" role="navigation">
        <div className="nav-wrapper container">Getting Started with PASS</div>
      </nav>
    </div>
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
