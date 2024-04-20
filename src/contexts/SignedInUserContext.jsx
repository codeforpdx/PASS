// React Imports
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
// Inrupt Library Imports
import { getPodUrlAll } from '@inrupt/solid-client';
import { SessionContext } from './SessionContext';
// Utility Imports
import { createPASSContainer } from '../utils';
// Model Imports
import {
  fetchAccountInfo,
  updateAccountInfo,
  uploadAccountImage,
  removeAccountImage
} from '../model-helpers';

/**
 * React Context for users list from Solid Pod
 *
 * @name UserListContext
 * @memberof contexts
 */

export const SignedInUserContext = createContext({});

/**
 * The Provider for SignedInUserContext
 *
 * @memberof contexts
 * @function SignedInUserContextProvider
 * @param {React.JSX.Element} children - The wrapped components that consumes
 * Context from Provider
 */

export const SignedInUserContextProvider = ({ children }) => {
  const { session } = useContext(SessionContext);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [podUrl, setPodUrl] = useState('');
  const [accountData, setAccountData] = useState(null);

  const userInfoMemo = useMemo(
    () => ({
      podUrl,
      accountData,
      setAccountData: async (newAccountData) => setAccountData(newAccountData),
      fetchAccountInfo,
      updateAccountInfo,
      uploadAccountImage,
      removeAccountImage
    }),
    [podUrl, accountData, loadingUserInfo]
  );

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const { webId } = session.info;
        let fetchedPodUrl = (await getPodUrlAll(webId, { fetch: session.fetch }))[0];
        fetchedPodUrl = fetchedPodUrl || webId.split('profile')[0];
        setPodUrl(fetchedPodUrl);
        const fetchedAccountData = await fetchAccountInfo(webId);
        if (fetchedAccountData.accountInfo.accountImage) {
          localStorage.setItem('accountImage', fetchedAccountData.accountInfo.accountImage);
        }
        setAccountData(fetchedAccountData);
        await Promise.all([
          createPASSContainer(session, fetchedPodUrl, 'Documents'),
          createPASSContainer(session, fetchedPodUrl, 'Profile')
        ]);
      } finally {
        setLoadingUserInfo(false);
      }
    };

    if (session.info.isLoggedIn) {
      loadUserInfo();
    }
  }, [session.info.isLoggedIn]);

  return (
    <SignedInUserContext.Provider value={userInfoMemo}>{children}</SignedInUserContext.Provider>
  );
};
