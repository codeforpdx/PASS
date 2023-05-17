import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQueryForm,
  CrossPodWriteForm,
  SetAclPermissionForm,
  SetAclPermsDocContainerForm,
  CheckAclPermsDocContainerForm
} from './Form';

/**
 * Forms Component - Component that generates Forms section for PASS
 *
 * @memberof GlobalComponents
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
