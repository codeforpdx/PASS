import React, { createContext, useState, useMemo, useEffect } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { getPodUrlAll } from '@inrupt/solid-client';

/**
 * React Context for users list from Solid Pod
 *
 * @name UserListContext
 * @memberof contexts
 */
export const SignedInUserContext = createContext({});

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
      let podUrl = (await getPodUrlAll(session.info.webId, { fetch: session.fetch }))[0];
      podUrl = podUrl || session.info.webId.split('profile')[0];

      try {
        setUserInfo({
          ...userInfo,
          podUrl
        });
      } finally {
        setLoadingUserInfo(false);
      }
    };

    loadUserInfo();
  }, [session]);

  return !loadingUserInfo ? (
    <SignedInUserContext.Provider value={userInfoMemo}>{children}</SignedInUserContext.Provider>
  ) : null;
};
