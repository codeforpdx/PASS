import { Container, MenuList, MenuItem } from '@mui/material';
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { HMIS_FORM_LIST } from '@constants';

const HmisProfile = () => {
  const location = useLocation();

  const currentForm = location.pathname.split('/').pop();

  return (
    <Container sx={{ display: 'flex' }}>
      <Container sx={{ width: '25%' }}>
        <nav>
          <MenuList>
            {HMIS_FORM_LIST.map((form) => (
              <Link to={form.path} style={{ textDecoration: 'none' }}>
                <MenuItem
                  divider
                  selected={
                    currentForm === form.path ||
                    (currentForm === 'hmis_profile' && form.path === '')
                  }
                >
                  {form.label}
                </MenuItem>
              </Link>
            ))}
          </MenuList>
        </nav>
      </Container>
      <Container>
        <Outlet />
      </Container>
    </Container>
  );
};

export default HmisProfile;
