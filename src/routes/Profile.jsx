// React Imports
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
// Inrupt Imports
import {
  buildThing,
  getStringNoLocale,
  getThing,
  getWebIdDataset,
  saveSolidDatasetAt,
  setThing
} from '@inrupt/solid-client';
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
// Constants Imports
import { RDF_PREDICATES } from '../constants';

const Profile = () => {
  const location = useLocation();
  const { session } = useSession();

  localStorage.setItem('restorePath', location.pathname);

  const [profileName, setProfileName] = useState('');
  const [editProfileName, setEditProfileName] = useState(false);

  const fetchProfileInfo = async () => {
    const profileDataset = await getWebIdDataset(session.info.webId);
    const profileThing = getThing(profileDataset, session.info.webId);

    const name = getStringNoLocale(profileThing, RDF_PREDICATES.profileName);
    if (typeof name === 'object') {
      setProfileName('No name has been set');
    } else {
      setProfileName(name);
    }
  };

  const handleEditProfileName = () => {
    setEditProfileName(!editProfileName);
  };

  const handleUpdateProfileName = async (event) => {
    event.preventDefault();
    let profileDataset = await getWebIdDataset(session.info.webId);
    let profileThing = getThing(profileDataset, session.info.webId);
    const name = getStringNoLocale(profileThing, RDF_PREDICATES.profileName);

    if (typeof name === 'object') {
      profileThing = buildThing(profileThing)
        .addStringNoLocale(RDF_PREDICATES.profileName, profileName)
        .build();
    } else {
      profileThing = buildThing(profileThing)
        .setStringNoLocale(RDF_PREDICATES.profileName, profileName)
        .build();
    }

    profileDataset = setThing(profileDataset, profileThing);

    await saveSolidDatasetAt(session.info.webId, profileDataset, { fetch: session.fetch });
    setEditProfileName(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px' }}>
      <Button variant="contained" type="button" onClick={fetchProfileInfo} sx={{ width: '150px' }}>
        Get Profile
      </Button>
      <Box>
        <form onSubmit={handleUpdateProfileName} style={{ display: 'flex', gap: '10px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {editProfileName ? (
              <>
                <Typography>Name: </Typography>
                <Input
                  value={profileName}
                  placeholder={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </>
            ) : (
              <Typography>Name: {profileName}</Typography>
            )}
            {profileName && (
              <Button variant="outlined" type="button" onClick={handleEditProfileName}>
                {editProfileName ? 'Cancel' : 'Edit'}
              </Button>
            )}
          </Box>
          {profileName && editProfileName && (
            <Button variant="outlined" type="submit">
              Update
            </Button>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default Profile;
