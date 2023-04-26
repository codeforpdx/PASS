import React from 'react';
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQueryForm,
  CrossPodWriteForm,
  SetAclPermissionForm
} from './Form';
import { Logout } from './Login';
import AppHeader from './AppHeader';

/**
 * Forms Component - Component that generates Forms section for PASS
 *
 * @memberof GlobalComponents
 * @name Forms
 */

const Forms = () => (
  <>
    <AppHeader />
    <Logout />
    <UploadDocumentForm />
    <FetchDocumentForm />
    <DeleteDocumentForm />
    <SetAclPermissionForm />
    <CrossPodQueryForm />
    <CrossPodWriteForm />
  </>
);

export default Forms;
