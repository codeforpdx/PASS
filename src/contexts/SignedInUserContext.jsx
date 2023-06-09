// React Imports
import React, { createContext, useState, useMemo, useEffect } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
import { getPodUrlAll } from '@inrupt/solid-client';
// Utility Imports
import { createPublicContainer, createDocumentContainer } from '../utils';
import { updateUserActivity } from '../model-helpers';

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
  const { session } = useSession();
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [userInfo, setUserInfo] = useState({
    podUrl: null
  });

  const userInfoMemo = useMemo(
    () => ({
      podUrl: userInfo.podUrl
    }),
    [userInfo, loadingUserInfo]
  );

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const { webId } = session.info;
        let podUrl = (await getPodUrlAll(webId, { fetch: session.fetch }))[0];
        podUrl = podUrl || webId.split('profile')[0];
        setUserInfo({
          ...userInfo,
          podUrl
        });
        await Promise.all([
          updateUserActivity(session, podUrl),
          createPublicContainer(session, podUrl),
          createDocumentContainer(session, podUrl)
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
