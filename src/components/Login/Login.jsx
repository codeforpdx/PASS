import { useSession, LoginButton, LogoutButton } from "@inrupt/solid-ui-react";
import { useState, useEffect } from "react";
import { SOLID_IDENTITY_PROVIDER } from "../../utils";

const Login = () => {
  const { session } = useSession();
  const [currentUrl, setCurrentUrl] = useState("http://localhost:3000");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [setCurrentUrl]);

  return (
    <section id="login" className="panel">
      <div className="col s12 m7">
        <div className="card horizontal">
          <div className="card-stacked">
            <div className="card-content">
              <div className="section no-pad-bot">
                <label id="labelLogin" htmlFor="btnLogin">
                  Click the following login button to log into your pod at [
                  <a href={SOLID_IDENTITY_PROVIDER} target="_blank">
                    {SOLID_IDENTITY_PROVIDER}
                  </a>
                  ]:{" "}
                </label>
                {!session.info.isLoggedIn ? (
                  <LoginButton
                    oidcIssuer={SOLID_IDENTITY_PROVIDER}
                    redirectUrl={currentUrl}
                    onError={console.error}
                  >
                    <div className="row center">
                      <a
                        id="download-button"
                        className="btn-large waves-effect waves-light teal"
                      >
                        Get Started
                      </a>
                    </div>
                  </LoginButton>
                ) : (
                  <LogoutButton>
                    <button>Logout</button>
                  </LogoutButton>
                )}
                {session.info.isLoggedIn ? (
                  <p className="labelStatus" role="alert">
                    Your session is logged in with the WebID [
                    <a href={session.info.webId} target="_blank">
                      {session.info.webId}
                    </a>
                    ].
                  </p>
                ) : (
                  <p>Not logged in</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
