import { Card, Container, Link } from '@mui/material';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box } from '@mui/system';
import HMIS_FORM_LIST from './FormList';

const FormLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname.split('/').pop();

  localStorage.setItem('restorePath', location.pathname);
  const pageIdx = HMIS_FORM_LIST.findIndex((form) => form.path === path);
  return (
    <Container sx={{ margin: '8px' }}>
      <Card>{children}</Card>
      <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {pageIdx > 0 ? (
          <Link component={RouterLink} to={`../${HMIS_FORM_LIST[pageIdx - 1].path}`}>
            &lt; Prev
          </Link>
        ) : (
          <Box />
        )}
        {pageIdx < HMIS_FORM_LIST.length - 1 ? (
          <Link component={RouterLink} to={`../${HMIS_FORM_LIST[pageIdx + 1].path}`}>
            Next &gt;
          </Link>
        ) : (
          <Box />
        )}
      </Container>
    </Container>
  );
};

export default FormLayout;
