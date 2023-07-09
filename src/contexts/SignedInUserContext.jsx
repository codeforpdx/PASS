// React Imports
import React, { createContext, useState, useMemo, useEffect } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
import { getPodUrlAll } from '@inrupt/solid-client';
// Utility Imports
import { createDocumentsContainer, createPublicContainer } from '../utils';
import {
  fetchProfileInfo,
  updateProfileInfo,
  uploadProfileImage,
  removeProfileImage,
  updateUserActivity
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
  const { session } = useSession();
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [userInfo, setUserInfo] = useState({
    podUrl: null,
    profileData: null
  });

  const userInfoMemo = useMemo(
    () => ({
      podUrl: userInfo.podUrl,
      profileData: userInfo.profileData,
      setProfileData: async (profileData) => setUserInfo({ ...userInfo, profileData }),
      fetchProfileInfo,
      updateProfileInfo,
      uploadProfileImage,
      removeProfileImage
    }),
    [userInfo, loadingUserInfo]
  );

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const { webId } = session.info;
        let podUrl = (await getPodUrlAll(webId, { fetch: session.fetch }))[0];
        podUrl = podUrl || webId.split('profile')[0];
        const profileData = await fetchProfileInfo(session);
        if (profileData.profileInfo.profileImage) {
          localStorage.setItem('profileImage', profileData.profileInfo.profileImage);
        }
        setUserInfo({
          podUrl,
          profileData
        });
        await Promise.all([
          createPublicContainer(session, podUrl),
          createDocumentsContainer(session, podUrl),
          updateUserActivity(session, podUrl)
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
