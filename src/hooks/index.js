import { Session } from "@inrupt/solid-client-authn-browser";
import { useEffect, useState } from "react";
import { SOLID_IDENTITY_PROVIDER } from "../utils/session-helper";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const clearValue = () => {
    setValue("");
  };

  return {
    type,
    value,
    onChange,
    clearValue,
  };
};

export const useSession = () => {
  const [session, setSession] = useState(new Session());
  const [_sessionInfo, setSessionInfo] = useState(false);

  useEffect(() => {
    handleRedirectAfterLogin();
  }, [session]);

  const loginPod = async () => {
    if (!session.info.isLoggedIn) {
      await session.login({
        oidcIssuer: SOLID_IDENTITY_PROVIDER,
        redirectUrl: window.location.href,
      });
    }
  };

  const handleLogin = async () => {
    loginPod();
  };

  const handleRedirectAfterLogin = async () => {
    const response = await session.handleIncomingRedirect(window.location.href);
    setSessionInfo(response);
  };

  return {
    session,
    setSession,
    handleLogin,
  };
};
