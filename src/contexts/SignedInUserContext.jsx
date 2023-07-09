// React Imports
import React, { createContext, useState, useMemo, useEffect } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
import { getPodUrlAll } from '@inrupt/solid-client';
// Utility Imports
import { generateDocumentsAcl, createPublicContainer } from '../utils';
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
  const [podUrl, setPodUrl] = useState('');
  const [profileData, setProfileData] = useState(null);

  const userInfoMemo = useMemo(
    () => ({
      podUrl,
      profileData,
      setProfileData: async (newProfileData) => setProfileData(newProfileData),
      fetchProfileInfo,
      updateProfileInfo,
      uploadProfileImage,
      removeProfileImage
    }),
    [podUrl, profileData, loadingUserInfo]
  );

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const { webId } = session.info;
        const fetchedPodUrl = (await getPodUrlAll(webId, { fetch: session.fetch }))[0];
        setPodUrl(fetchedPodUrl || webId.split('profile')[0]);
        const fetchedProfileData = await fetchProfileInfo(session);
        if (fetchedProfileData.profileInfo.profileImage) {
          localStorage.setItem('profileImage', fetchedProfileData.profileInfo.profileImage);
        }
        setProfileData(fetchedProfileData);
        await Promise.all([
          createPublicContainer(session, podUrl),
          generateDocumentsAcl(session, podUrl),
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

  console.log(userInfoMemo);

  return (
    <SignedInUserContext.Provider value={userInfoMemo}>{children}</SignedInUserContext.Provider>
  );
};
