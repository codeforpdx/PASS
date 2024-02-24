// React Imports
import React, { useContext, useEffect, useState } from 'react';
// Custom Hook Imports
import { useNotification, useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
 * @param {string} [Props.webId] - The webId of the contact
 * or null if user profile is selected
 * @returns {React.JSX.Element} The UserProfile Component
 */
const ProfileComponent = ({ contactProfile, webId }) => {
  const { session } = useSession();
  const { addNotification } = useNotification();
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
  const signupLink = `${window.location.origin}/signup?webId=${encodeURIComponent(
    session.info.webId
  )}`;

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
          <ProfileInputField
            inputName="WebId"
            inputValue={webId}
            endAdornment={
              <IconButton
                aria-label="Copy WebId"
                edge="end"
                onClick={() => {
                  navigator.clipboard.writeText(webId);
                  addNotification('success', 'webId copied to clipboard');
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            }
          />
        </Box>
        {!contactProfile && (
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <ProfileEditButtonGroup
              edit={edit}
              handleCancelEdit={handleCancelEdit}
              handleEditInput={handleEditInput}
            />
            <Typography sx={{ marginTop: '8px' }}>
              <Button
                onClick={() =>
                  session.logout({
                    logoutType: 'idp',
                    postLogoutUrl: `${window.location.href}`,
                    state: `webId=${encodeURIComponent(session.info.webId)}`
                  })
                }
              >
                Your Invite Link
              </Button>
              <IconButton
                aria-label="Copy Invite Link"
                edge="end"
                onClick={() => {
                  navigator.clipboard.writeText(signupLink);
                  addNotification('success', 'Invite link copied to clipboard');
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Typography>
          </Box>
        )}
      </form>
    </Box>
  );
};

export default ProfileComponent;
