// React Imports
import React from 'react';
import { useLocation } from 'react-router-dom';
// Component Imports
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQueryForm,
  CrossPodWriteForm,
  SetAclPermissionForm,
  SetAclPermsDocContainerForm,
  CheckAclPermsDocContainerForm
} from '../components/Form';

/**
 * Forms Page - Component that generates Forms Page for PASS
 *
 * @memberof Pages
 * @name Forms
 */

const Forms = () => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  return (
    <>
      <UploadDocumentForm />
      <FetchDocumentForm />
      <DeleteDocumentForm />
      <SetAclPermsDocContainerForm />
      <CheckAclPermsDocContainerForm />
      <SetAclPermissionForm />
      <CrossPodQueryForm />
      <CrossPodWriteForm />
    </>
  );
};

export default Forms;
