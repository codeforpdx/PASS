// React Imports
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Custom Hooks Imports
import { useNotification, useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Util Imports
import { saveToClipboard } from '@utils';
// Component Inputs
import ProfileInputField from './ProfileInputField';
import ProfileEditButtonGroup from './ProfileEditButtonGroup';
import ProfileImageField from './ProfileImageField';

/**
 * UserProfile - Component is a component that renders the user's profile on
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
  const signupLink = `${window.location.origin}/signup`;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        gap: '15px',
        padding: '10px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
        borderRadius: '10px'
      }}
    >
      <ProfileImageField loadProfileData={loadProfileData} contactProfile={contactProfile} />
      <form
        onSubmit={handleUpdateProfile}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '10px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {!contactProfile && (
            <ProfileEditButtonGroup
              edit={edit}
              handleCancelEdit={handleCancelEdit}
              handleEditInput={handleEditInput}
            />
          )}
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
                  saveToClipboard(webId, 'webId copied to clipboard', addNotification);
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            }
          />
        </Box>
        {!contactProfile && (
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignSelf: 'end' }}>
            <Typography sx={{ marginTop: '8px' }}>
              <Link to={`${signupLink}?webId=${encodeURIComponent(session.info.webId)}`}>
                Your Invite Link
              </Link>
              <IconButton
                aria-label="Copy Invite Link"
                edge="end"
                onClick={() => {
                  saveToClipboard(
                    `${signupLink}?webId=${encodeURIComponent(session.info.webId)}`,
                    'Invite link copied to clipboard',
                    addNotification
                  );
                }}
              >
                <FolderSharedIcon />
              </IconButton>
            </Typography>
          </Box>
        )}
      </form>
    </Box>
  );
};

export default ProfileComponent;
