import { useContext } from "react";
import { SessionContext } from "../../App";
import { SOLID_IDENTITY_PROVIDER } from "../../utils/session-helper";

const Login = ({ handleLogin, setUpdate }) => {
  const { session } = useContext(SessionContext);

  return (
    <section id="login" className="panel">
      <div className="row">
        <label id="labelLogin" htmlFor="btnLogin">
          1. Click the button to log into [
          <a target="_blank" href={SOLID_IDENTITY_PROVIDER}>
            {SOLID_IDENTITY_PROVIDER}
          </a>
          ]:{" "}
        </label>
        <button
          onClick={() => {
            handleLogin();
            setUpdate((prevState) => !prevState);
          }}
        >
          Login
        </button>
        {session.info.isLoggedIn ? (
          <p className="labelStatus" id="labelStatus" role="alert">
            Your session is logged in with the WebID [<a href={session.info.webId}>{session.info.webId}</a>].
          </p>
        ) : (
          <p>Not logged in</p>
        )}
      </div>
    </section>
  );
};

export default Login;
