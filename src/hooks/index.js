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

  useEffect(() => {
    handleRedirectAfterLogin();
    handleSession();
  });

  const loginPod = async () => {
    if (!session.info.isLoggedIn) {
      await session.login({
        oidcIssuer: SOLID_IDENTITY_PROVIDER,
        redirectUrl: window.location.href,
      });
    }
  };

  const handleRedirectAfterLogin = async () => {
    await session.handleIncomingRedirect(window.location.href);
  };

  const handleLogin = () => {
    loginPod();
    console.log("logging in...");
  };

  const handleSession = () => {
    setSession((state) => {
      return state;
    });
  };

  return {
    session,
    setSession,
    handleLogin,
  };
};
