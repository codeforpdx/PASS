// React Imports
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Inrupt Imports
import { useSession } from '@hooks';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import BackspaceIcon from '@mui/icons-material/Backspace';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
// Contexts Imports
import { SelectedUserContext, SignedInUserContext } from '../contexts';
// Component Inputs
import { ProfileInputField, ProfileImageField } from '../components/Profile';
import { SetAclPermissionForm, SetAclPermsDocContainerForm } from '../components/Form';
import { UploadDocumentModal } from '../components/Modals';
import DocumentTable from '../components/Documents/DocumentTable';
import { ClientProfileInfo } from '../components/Clients';

/**
 * @typedef {import("../typedefs.js").profilePageProps} profilePageProps
 */

/**
 * Profile Page - Page that displays the user's profile card information and
 * allow users to edit/update them on PASS
 *
 * @memberof Pages
 * @name Profile
 * @param {profilePageProps} Props - Props for Profile Page
 * @returns {React.JSX.Element} The Profile Page
 */
const Profile = ({ user }) => {
  const location = useLocation();
  const { session } = useSession();
  const { updateProfileInfo, setProfileData, profileData, fetchProfileInfo } =
    useContext(SignedInUserContext);
  const [showModal, setShowModal] = useState(false);
  const { selectedUser, setSelectedUser } = useContext(SelectedUserContext);

  localStorage.setItem('restorePath', location.pathname);

  const [profileName, setProfileName] = useState(profileData?.profileInfo.profileName);
  const [nickname, setNickname] = useState(profileData?.profileInfo.nickname);

  const [edit, setEdit] = useState(false);

  const loadProfileData = async () => {
    const profileDataSolid = await fetchProfileInfo(session);
    setProfileData(profileDataSolid);

    setProfileName(profileDataSolid.profileInfo.profileName);
    setNickname(profileDataSolid.profileInfo.nickname);
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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '30px'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Profile Information</Typography>

        <Typography>
          User WebId:{' '}
          <Link
            href={user === 'personal' ? session.info.webId : selectedUser.webId}
            target="_blank"
            rel="noreferrer"
          >
            {user === 'personal' ? session.info.webId : selectedUser.webId}
          </Link>
        </Typography>

        {/* TODO: Refactor/optimize the form below once we have more input */}
        {/* fields to update profile for */}
        {user === 'personal' ? (
          <Box
            style={{
              display: 'flex',
              gap: '15px',
              padding: '10px'
            }}
          >
            <ProfileImageField loadProfileData={loadProfileData} />
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
                  inputValue={profileName}
                  setInputValue={setProfileName}
                  edit={edit}
                />
                <ProfileInputField
                  inputName="Nickname"
                  inputValue={nickname}
                  setInputValue={setNickname}
                  edit={edit}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px'
                }}
              >
                {edit ? (
                  <>
                    <Button
                      variant="outlined"
                      type="button"
                      color="error"
                      endIcon={<ClearIcon />}
                      onClick={handleCancelEdit}
                      sx={{ width: '100px' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outlined"
                      type="submit"
                      endIcon={<CheckIcon />}
                      sx={{ width: '100px' }}
                    >
                      Update
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    type="button"
                    color="primary"
                    endIcon={<EditIcon />}
                    onClick={handleEditInput}
                    sx={{ width: '100px' }}
                  >
                    Edit
                  </Button>
                )}
              </Box>
            </form>
          </Box>
        ) : (
          <>
            <Link to="/PASS/clients" style={{ textDecoration: 'none', color: 'white' }}>
              <Button
                variant="contained"
                color="secondary"
                aria-label="Back Button"
                startIcon={<BackspaceIcon />}
                onClick={() => setSelectedUser()}
              >
                Go Back
              </Button>
            </Link>
            <ClientProfileInfo selectedUser={selectedUser} />
          </>
        )}

        <Button
          variant="contained"
          color="secondary"
          size="small"
          aria-label="Add Client Button"
          startIcon={<AddIcon />}
          onClick={() => setShowModal(true)}
        >
          Add Document
        </Button>
        <UploadDocumentModal showModal={showModal} setShowModal={setShowModal} user={user} />
        <DocumentTable user={user} />
        <SetAclPermsDocContainerForm user={user} />
        <SetAclPermissionForm user={user} />
      </Box>
    </Box>
  );
};

export default Profile;
