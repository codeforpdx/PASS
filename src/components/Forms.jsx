import React from 'react';
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQueryForm,
  CrossPodWriteForm,
  SetAclPermissionForm
} from './Form';
import NavBar from './NavBar/NavBar';
import { ThemeProvider } from '@emotion/react';
import theme from '../theme';

/**
 * Forms Component - Component that generates Forms section for PASS
 *
 * @memberof GlobalComponents
 * @name Forms
 */

const Forms = () => (
  <>
    <NavBar />
    <UploadDocumentForm />
    <FetchDocumentForm />
    <DeleteDocumentForm />
    <SetAclPermissionForm />
    <CrossPodQueryForm />
    <CrossPodWriteForm />
  </>
);

export default Forms;
