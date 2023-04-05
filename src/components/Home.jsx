import React from 'react';
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQueryForm,
  CrossPodWriteForm,
  SetAclPermissionForm,
  ManageUsers
} from './Form';
import { Logout } from './Login';
import UsersList from './Users/UsersList';

const Home = () => (
  <>
    <Logout />
    <UploadDocumentForm />
    <FetchDocumentForm />
    <DeleteDocumentForm />
    <ManageUsers />
    <UsersList />
    <SetAclPermissionForm />
    <CrossPodQueryForm />
    <CrossPodWriteForm />
  </>
);

export default Home;
