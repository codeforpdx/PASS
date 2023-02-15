/**
 * hooks module contains custom hooks to assist with form handling or session login/logout
 * @namespace hooks
 */

import { logout, Session } from "@inrupt/solid-client-authn-browser";
import { useEffect, useState } from "react";
import { SOLID_IDENTITY_PROVIDER } from "../utils/session-helper";

/**
 * @typedef {Object} useFieldObject
 * @property {string} type - Type attribute of HTML input element
 * @property {string} value - The value of input element
 * @property {function} onChange - Event handler for changes in input element
 * @property {function} clearValue - Event handler that clears value set for input element
 */

/**
 * Custom hook that provide the value of input element, type attribute of HTML input element, set value of input element onChange, and a clear value function
 * @memberof hooks
 * @function useField
 * @param {string} type - Type attribute of HTML input element
 * @return {useFieldObject} useFieldObject - An object that contains { type, value, onChange, clearValue }
 */

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

/**
 * @typedef {Object} useSessionObject
 * @property {Session} session - State for Solid session
 * @property {React.SetStateAction} setSession - React setState function for session
 * @property {function} handleLogin - Function that handles Solid login and logout
 */

/**
 * Custom hook that provide the value of input element, type attribute of HTML input element, set value of input element onChange, and a clear value function
 * @memberof hooks
 * @function useSession
 * @return {useSessionObject} useSessionObject - An object that contains { session, setSession, handleLogin }
 */

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
    if (!session.info.isLoggedIn) {
      loginPod();
    } else {
      logout();
      window.location.reload();
    }
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
