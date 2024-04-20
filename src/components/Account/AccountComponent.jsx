// React Imports
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Custom Hook Imports
import { useNotification, useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Inputs
import AccountInputField from './AccountInputField';
import AccountEditButtonGroup from './AccountEditButtonGroup';
import AccountImageField from './AccountImageField';

/**
 * The UserAccount Component is a component that renders the user's profile on
 * PASS
 *
 * @memberof Account
 * @name AccountComponent
 * @param {object} Props - Props for ClientAccount component
 * @param {object} [Props.contactAccount] - Contact object with data from profile
 * @param {string} [Props.webId] - The webId of the contact
 * or null if user profile is selected
 * @returns {React.JSX.Element} The UserAccount Component
 */
const AccountComponent = ({ contactAccount, webId }) => {
  const { session } = useSession();
  const { addNotification } = useNotification();
  const { updateAccountInfo, setAccountData, accountData, fetchAccountInfo } =
    useContext(SignedInUserContext);

  // Public Account Data
  const [accountName, setAccountName] = useState(accountData?.accountInfo?.accountName);
  const [nickname, setNickname] = useState(accountData?.accountInfo?.nickname);

  const [edit, setEdit] = useState(false);

  const loadAccountData = async () => {
    const accountDataSolid = await fetchAccountInfo(session.info.webId);
    setAccountData(accountDataSolid);

    setAccountName(accountDataSolid.accountInfo?.accountName);
    setNickname(accountDataSolid.accountInfo?.nickname);
  };

  const handleCancelEdit = () => {
    loadAccountData();
    setEdit(!edit);
  };

  const handleEditInput = () => {
    setEdit(!edit);
  };

  const handleUpdateAccount = async (event) => {
    event.preventDefault();

    const inputValues = {
      accountName,
      nickname
    };

    await updateAccountInfo(session, accountData, inputValues);

    loadAccountData();
    setEdit(false);
  };

  useEffect(() => {
    loadAccountData();
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
      <AccountImageField loadAccountData={loadAccountData} contactAccount={contactAccount} />
      <form
        onSubmit={handleUpdateAccount}
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
          {!contactAccount && (
            <AccountEditButtonGroup
              edit={edit}
              handleCancelEdit={handleCancelEdit}
              handleEditInput={handleEditInput}
            />
          )}
          <AccountInputField
            inputName="Name"
            inputValue={
              contactAccount
                ? `${contactAccount?.givenName ?? ''} ${contactAccount?.familyName ?? ''}`
                : accountName
            }
            setInputValue={setAccountName}
            edit={edit}
          />
          <AccountInputField
            inputName="Nickname"
            inputValue={contactAccount ? contactAccount?.nickname : nickname}
            setInputValue={setNickname}
            edit={edit}
          />
          <AccountInputField
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
        {!contactAccount && (
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignSelf: 'end' }}>
            <Typography sx={{ marginTop: '8px' }}>
              <Link to={`${signupLink}?webId=${encodeURIComponent(session.info.webId)}`}>
                Your Invite Link
              </Link>
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

export default AccountComponent;
