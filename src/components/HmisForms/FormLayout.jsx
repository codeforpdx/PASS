import { Card, Container, Link } from '@mui/material';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { HMIS_FORM_LIST } from '@constants';
import { Box } from '@mui/system';

const FormLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname.split('/').pop();

  const pageIdx =
    path === 'hmis_profile' ? 0 : HMIS_FORM_LIST.findIndex((form) => form.path === path);
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
          <Link
            component={RouterLink}
            to={
              pageIdx === 0
                ? HMIS_FORM_LIST[pageIdx + 1].path
                : `../${HMIS_FORM_LIST[pageIdx + 1].path}`
            }
          >
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
