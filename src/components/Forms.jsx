import React from 'react';
import { ThemeProvider } from '@emotion/react';
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQueryForm,
  CrossPodWriteForm,
  SetAclPermissionForm
} from './Form';
import NavBar from './NavBar/NavBar';
import theme from '../theme';
import Footer from "./Form/Footer";

/**
 * Forms Component - Component that generates Forms section for PASS
 *
 * @memberof GlobalComponents
 * @name Forms
 */

const Forms = () => (
  <ThemeProvider theme={theme}>
    <NavBar />
    <UploadDocumentForm />
    <FetchDocumentForm />
    <DeleteDocumentForm />
    <SetAclPermissionForm />
    <CrossPodQueryForm />
    <CrossPodWriteForm />
    <Footer />
  </ThemeProvider>
);

export default Forms;
