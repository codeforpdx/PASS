import React from 'react';
import { NavBar } from '../components/NavBar';

const Layout = ({ children }) => (
  <>
    <NavBar />
    {children}
  </>
);

export default Layout;
