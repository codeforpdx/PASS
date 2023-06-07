import { useState, useEffect } from 'react';

/**
 * Custom hook that provides the redirect URL for Solid session login and stores
 * it in localStorage if it doesn't exist there
 *
 * @memberof hooks
 * @function useRedirectUrl
 * @returns {URL} redirectUrl - A string containing the redirect URL for Solid
 * session login
 */

const useRedirectUrl = () => {
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('redirectUrl') && Boolean(localStorage.getItem('loggedIn'))) {
      localStorage.setItem('redirectUrl', window.location.href.split('#')[0]);
      setRedirectUrl(window.location.href.split('#')[0]);
    } else {
      setRedirectUrl(localStorage.getItem('redirectUrl'));
    }
  }, [redirectUrl]);

  return redirectUrl;
};

export default useRedirectUrl;
