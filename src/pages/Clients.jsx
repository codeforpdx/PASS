// React Imports
import React from 'react';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Link } from '@mui/material';
// Component Imports
import { ClientList } from '@components/Clients';
import { useSession } from '@hooks';

/**
 * Clients Component - Component that generates Clients Page for PASS
 *
 * @memberof Pages
 * @name Clients
 */

const Clients = () => {
  const { session } = useSession();
  localStorage.setItem('restorePath', '/clients');

  return (
    <Container>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        aria-label="Add Client Button"
        startIcon={<AddIcon />}
        sx={{ marginTop: '3rem' }}
      >
        <Link
          href={`${window.location.origin}/signup?webId=${encodeURIComponent(session.info.webId)}`}
          style={{
            textDecoration: 'none',
            color: 'inherit'
          }}
          target="_blank"
          rel="noreferrer noopener"
        >
          Add Client
        </Link>
      </Button>
      <ClientList />
    </Container>
  );
};

export default Clients;
