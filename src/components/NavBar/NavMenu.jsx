// React Imports
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
// Material UI Imports
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import ContactsIcon from '@mui/icons-material/Contacts';
import Divider from '@mui/material/Divider';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Context Imports
import { DocumentListContext } from '@contexts';
import { useMessageList } from '@hooks';

/**
 * NavMenu Component - Component that generates NavMenu section for PASS
 *
 * @memberof NavBar
 * @name NavMenu
 * @param {object} Props - The props for NavMenu Component
 * @param {string} Props.menuId - The menu id
 * @param {boolean} Props.openMenu - The state for opening menu
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setOpenMenu
 * - The set function for openMenu
 * @param {any} Props.anchorEl - The state for anchorEl
 * @param {React.Dispatch<any>} Props.setAnchorEl - The set function for anchorEl
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowConfirmation
 * - The set function for showConfirmationModal
 * @param {(event) => void} Props.handleNotificationsMenu - Handler function for
 * Notification Menu
 * @param {string} Props.profileImg - String for profile image
 * @returns {React.JSX.Element} - The NavMenu Component
 */
const NavMenu = ({
  menuId,
  openMenu,
  setOpenMenu,
  anchorEl,
  setAnchorEl,
  setShowConfirmation,
  handleNotificationsMenu,
  profileImg
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { setContact } = useContext(DocumentListContext);
  const { data } = useMessageList('Inbox');

  const numUnreadMessages = data?.reduce((a, m) => (!m.readStatus ? a + 1 : a), 0);

  const handleMenuClose = () => {
    setOpenMenu(false);
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={openMenu}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      MenuListProps={{ disablePadding: true }}
      slotProps={{
        paper: {
          style: {
            marginTop: '10px'
          }
        }
      }}
      sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <MenuList>
        {isSmallScreen && (
          <div>
            <Link
              to="/contacts"
              style={{ textDecoration: 'none', color: theme.palette.primary.main }}
            >
              <MenuItem
                component={Button}
                startIcon={<ContactsIcon sx={{ height: '24px', width: '24px' }} />}
                sx={{
                  display: { md: 'none' },
                  color: theme.palette.primary.main,
                  width: '100%',
                  minHeight: '36px'
                }}
              >
                Contacts
              </MenuItem>
            </Link>
            <Link
              to="/civic-profile/basic-info"
              style={{ textDecoration: 'none', color: theme.palette.primary.main }}
            >
              <MenuItem
                component={Button}
                startIcon={<AccountBoxIcon sx={{ height: '24px', width: '24px' }} />}
                sx={{
                  display: { md: 'none' },
                  color: theme.palette.primary.main,
                  width: '100%',
                  minHeight: '36px'
                }}
              >
                Civic Profile
              </MenuItem>
            </Link>
            <Divider sx={{ marginY: '5px' }} />
          </div>
        )}
        {/* messages */}
        <Link to="/messages" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
          <MenuItem
            component={Button}
            startIcon={
              <Badge variant={numUnreadMessages > 0 ? 'dot' : 'standard'} color="error">
                <EmailIcon sx={{ height: '24px', width: '24px' }} />
              </Badge>
            }
            sx={{
              display: { md: 'none' },
              color: theme.palette.primary.main,
              width: '100%',
              minHeight: '36px'
            }}
          >
            Messages
          </MenuItem>
        </Link>
        {/* notifications */}
        <MenuItem
          component={Button}
          startIcon={<NotificationsIcon sx={{ height: '24px', width: '24px' }} />}
          onClick={handleNotificationsMenu}
          sx={{
            display: { md: 'none' },
            color: theme.palette.primary.main,
            width: '100%',
            minHeight: '36px'
          }}
        >
          Notifications
        </MenuItem>
        {/* profile */}
        <Link
          to="/profile"
          state={{ contact: null }}
          style={{ textDecoration: 'none', color: theme.palette.primary.main }}
          onClick={() => setContact(null)}
        >
          <MenuItem
            component={Button}
            sx={{ width: '100%', minHeight: '36px' }}
            startIcon={
              <Avatar
                src={profileImg}
                alt="PASS profile"
                sx={{
                  height: '24px',
                  width: '24px',
                  objectFit: 'contain',
                  color: theme.palette.primary.contrastText,
                  backgroundColor: theme.palette.primary.main
                }}
              />
            }
          >
            Profile
          </MenuItem>
        </Link>
        <Divider sx={{ marginY: '5px' }} />
        {/* settings */}
        <MenuItem
          component={Button}
          startIcon={<SettingsIcon sx={{ height: '24px', width: '24px' }} />}
          sx={{ color: theme.palette.primary.main, width: '100%', minHeight: '36px' }}
        >
          Settings
        </MenuItem>
        {/* logout */}
        <MenuItem
          component={Button}
          startIcon={<LogoutIcon sx={{ height: '24px', width: '24px' }} />}
          onClick={() => setShowConfirmation(true)}
          sx={{ color: theme.palette.error.main, width: '100%', minHeight: '36px' }}
        >
          Log Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NavMenu;
