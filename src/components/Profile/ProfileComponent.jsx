// React Imports
import React, { useContext, useEffect, useState } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Inputs
import ProfileImageField from './ProfileImageField';
import ProfileInputField from './ProfileInputField';
import ProfileEditButtonGroup from './ProfileEditButtonGroup';

/**
 * The UserProfile Component is a component that renders the user's profile on
 * PASS
 *
 * @memberof Profile
 * @name ProfileComponent
 * @param {object} Props - Props for ClientProfile component
 * @param {object} [Props.contactProfile] - Contact object with data from profile
 * or null if user profile is selected
 * @returns {React.JSX.Element} The UserProfile Component
 */
const ProfileComponent = ({ contactProfile }) => {
  const { session } = useSession();
  const { updateProfileInfo, setProfileData, profileData, fetchProfileInfo } =
    useContext(SignedInUserContext);

  // Public Profile Data
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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        gap: '15px',
        padding: '10px'
      }}
    >
      <ProfileImageField loadProfileData={loadProfileData} contactProfile={contactProfile} />
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
              contactProfile
                ? `${contactProfile?.givenName ?? ''} ${contactProfile?.familyName ?? ''}`
                : profileName
            }
            setInputValue={setProfileName}
            edit={edit}
          />
          <ProfileInputField
            inputName="Nickname"
            inputValue={contactProfile ? contactProfile?.nickname : nickname}
            setInputValue={setNickname}
            edit={edit}
          />
        </Box>
        {!contactProfile && (
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
