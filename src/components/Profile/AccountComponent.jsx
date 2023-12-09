// React Imports
import React, { useContext, useEffect, useState } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Inputs
import ProfileImageField from './ProfileImageField';
import ProfileInputField from './ProfileInputField';
import ProfileEditButtonGroup from './ProfileEditButtonGroup';

/**
 * The UserAccount Component is a component that renders the user's account on
 * PASS
 *
 * @memberof Profile
 * @name AccountComponent
 * @param {object} Props - Props for ClientProfile component
 * @param {object} [Props.contactProfile] - Contact object with data from profile
 * or null if user profile is selected
 * @returns {React.JSX.Element} The UserAccount Component
 */
const AccountComponent = ({ contactProfile }) => {
  const { session } = useSession();
  const { updateProfileInfo, setProfileData, profileData, fetchProfileInfo } =
    useContext(SignedInUserContext);

  // Public Profile Data (Account Data)
  const [accountName, setAccountName] = useState(profileData?.profileInfo?.profileName);
  const [nickname, setNickname] = useState(profileData?.profileInfo?.nickname);

  const [edit, setEdit] = useState(false);

  const loadAccountData = async () => {
    const profileDataSolid = await fetchProfileInfo(session.info.webId);
    setProfileData(profileDataSolid);

    setAccountName(profileDataSolid.profileInfo?.profileName);
    setNickname(profileDataSolid.profileInfo?.nickname);
  };

  const handleCancelEdit = () => {
    loadAccountData();
    setEdit(!edit);
  };

  const handleEditInput = () => {
    setEdit(!edit);
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    const inputValues = {
      accountName,
      nickname
    };

    await updateProfileInfo(session, profileData, inputValues);

    loadAccountData();
    setEdit(false);
  };

  useEffect(() => {
    loadAccountData();
  }, []);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack direction={isSmallScreen ? 'column' : 'row'} spacing={2} padding="10px">
      <ProfileImageField loadProfileData={loadAccountData} contactProfile={contactProfile} />
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
        <Stack spacing={1}>
          <ProfileInputField
            inputName="Name"
            inputValue={
              contactProfile
                ? `${contactProfile?.givenName ?? ''} ${contactProfile?.familyName ?? ''}`
                : accountName
            }
            setInputValue={setAccountName}
            edit={edit}
          />
          <ProfileInputField
            inputName="Nickname"
            inputValue={contactProfile ? contactProfile?.nickname : nickname}
            setInputValue={setNickname}
            edit={edit}
          />
        </Stack>
        {!contactProfile && (
          <ProfileEditButtonGroup
            edit={edit}
            handleCancelEdit={handleCancelEdit}
            handleEditInput={handleEditInput}
          />
        )}
      </form>
    </Stack>
  );
};

export default AccountComponent;
