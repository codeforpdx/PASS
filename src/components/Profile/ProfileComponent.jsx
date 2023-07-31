// React Imports
import React, { useContext, useEffect, useState } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Inputs
import ProfileImageField from './ProfileImageField';
import ProfileInputField from './ProfileInputField';
import ProfileEditButtonGroup from './ProfileEditButtonGroup';

/**
 * @typedef {import("../../typedefs.js").profileComponentProps} profileComponentProps
 */

/**
 * The UserProfile Component is a component that renders the user's profile on
 * PASS
 *
 * @memberof Profile
 * @name ProfileComponent
 * @param {profileComponentProps} Props - Props for ClientProfile component
 * @returns {React.JSX.Element} The UserProfile Component
 */
const ProfileComponent = ({ clientProfile }) => {
  const { session } = useSession();
  const { updateProfileInfo, setProfileData, profileData, fetchProfileInfo } =
    useContext(SignedInUserContext);

  const [profileName, setProfileName] = useState(profileData?.profileInfo?.profileName);
  const [nickname, setNickname] = useState(profileData?.profileInfo?.nickname);
  const [edit, setEdit] = useState(false);

  const loadProfileData = async () => {
    const profileDataSolid = await fetchProfileInfo(session.info.webId);
    setProfileData(profileDataSolid);

    setProfileName(profileDataSolid.profileInfo?.profileName);
    setNickname(profileDataSolid.profileInfo?.nickname);
  };

  const handleCancelEdit = () => {
    loadProfileData();
    setEdit(!edit);
  };

  const handleEditInput = () => {
    setEdit(!edit);
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    const inputValues = {
      profileName,
      nickname
    };

    await updateProfileInfo(session, profileData, inputValues);

    loadProfileData();
    setEdit(false);
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  return (
    <Box
      style={{
        display: 'flex',
        gap: '15px',
        padding: '10px'
      }}
    >
      <ProfileImageField loadProfileData={loadProfileData} clientProfile={clientProfile} />
      <form
        onSubmit={handleUpdateProfile}
        style={{
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 3px 0 black',
          justifyContent: 'space-between',
          padding: '20px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <ProfileInputField
            inputName="Name"
            inputValue={
              clientProfile
                ? `${clientProfile?.givenName ?? ''} ${clientProfile?.familyName ?? ''}`
                : profileName
            }
            setInputValue={setProfileName}
            edit={edit}
            disabled={clientProfile}
          />
          <ProfileInputField
            inputName="Nickname"
            inputValue={clientProfile ? clientProfile?.nickname : nickname}
            setInputValue={setNickname}
            edit={edit}
            disabled={clientProfile}
          />
        </Box>
        {!clientProfile && (
          <ProfileEditButtonGroup
            edit={edit}
            handleCancelEdit={handleCancelEdit}
            handleEditInput={handleEditInput}
          />
        )}
      </form>
    </Box>
  );
};

export default ProfileComponent;
