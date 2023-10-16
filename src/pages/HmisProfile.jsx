import { Container } from '@mui/material';
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { HMIS_FORM_LIST } from '@constants';

const HmisProfile = () => (
  <Container>
    <nav>
      <ul>
        {HMIS_FORM_LIST.map((form) => (
          <li>
            <Link to={form.path}>{form.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
    <Outlet />
  </Container>
);

export default HmisProfile;
