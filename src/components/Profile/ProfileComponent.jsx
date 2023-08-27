// React Imports
import React, { useContext, useEffect, useState } from 'react';
// Other Library Imports
import dayjs from 'dayjs';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
const ProfileComponent = ({ contactProfile }) => {
  const { session } = useSession();
  const { updateProfileInfo, setProfileData, profileData, fetchProfileInfo } =
    useContext(SignedInUserContext);

  // Public Profile Data
  const [profileName, setProfileName] = useState(profileData?.profileInfo?.profileName);
  const [nickname, setNickname] = useState(profileData?.profileInfo?.nickname);

  // Private Profile Data
  const [dateOfBirth, setDateOfBirth] = useState(profileData?.privateProfileData?.dateOfBirth);

  const [edit, setEdit] = useState(false);

  const loadProfileData = async () => {
    const profileDataSolid = await fetchProfileInfo(session, session.info.webId);
    setProfileData(profileDataSolid);

    setProfileName(profileDataSolid.profileInfo?.profileName);
    setNickname(profileDataSolid.profileInfo?.nickname);
    setDateOfBirth(profileDataSolid.privateProfileInfo?.dateOfBirth);
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

    const inputValuesPrivate = {
      dateOfBirth
    };

    await updateProfileInfo(session, profileData, inputValues, inputValuesPrivate);

    loadProfileData();
    setEdit(false);
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const renderDateOfBirth = () => {
    if (contactProfile) {
      return contactProfile.dateOfBirth
        ? dayjs(contactProfile.dateOfBirth).format('MM/DD/YYYY')
        : 'No value set';
    }
    return dateOfBirth ? dayjs(dateOfBirth).format('MM/DD/YYYY') : 'No value set';
  };

  return (
    <Box
      style={{
        display: 'flex',
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
            disabled={contactProfile}
          />
          <ProfileInputField
            inputName="Nickname"
            inputValue={contactProfile ? contactProfile?.nickname : nickname}
            setInputValue={setNickname}
            edit={edit}
            disabled={contactProfile}
          />
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>Date of Birth: </Typography>
            {edit ? (
              <FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    name="date"
                    format="MM/DD/YYYY"
                    value={dayjs(dateOfBirth)}
                    onChange={(newDateOfBirth) => setDateOfBirth(newDateOfBirth)}
                    type="date"
                  />
                </LocalizationProvider>
              </FormControl>
            ) : (
              renderDateOfBirth()
            )}
          </Box>
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
