import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { runNotification, setDocAclPermission } from '../../utils';
import { useStatusNotification } from '../../hooks';
import { StatusNotification } from '../Notification';
import DocumentSelection from './DocumentSelection';

/**
 * SetAclPermissionForm Component - Component that generates the form for setting document ACL permissions to another user's Solid Pod via Solid Session
 * @memberof Forms
 * @component
 * @name SetAclPermissionForm
 */

const SetAclPermissionForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();

  const handleAclPermission = async (event) => {
    event.preventDefault();
    try {
      await setDocAclPermission(
        session,
        event.target.document.value,
        event.target.setAclPerms.value,
        event.target.setAclTo.value
      );

      runNotification(
        `${event.target.setAclPerms.value} permission to ${event.target.setAclTo.value} for ${event.target.document.value}`,
        7,
        state,
        dispatch
      );
    } catch (error) {
      runNotification('Set permission failed. Reason: File not found', 7, state, dispatch);
    }
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <section className="panel">
      <div className="col s6">
        <div className="card horizontal">
          <div className="card-stacked">
            <div className="card-content">
              <div className="section no-pad-bot row center">
                <h5>
                  <strong>Permission to Files</strong>
                </h5>

                <form onSubmit={handleAclPermission} autoComplete="off">
                  <div style={formRowStyle}>
                    <label htmlFor="set-acl-to">
                      Paste other user's pod url (i.e., username.opencommons.net):{' '}
                    </label>
                    <br />
                    <br />
                    <input id="set-acl-to" size="60" type="text" name="setAclTo" />
                  </div>
                  <div style={formRowStyle}>
                    <label htmlFor="set-acl-doctype">Select document type: </label>
                    <DocumentSelection htmlId="set-acl-doctype" />{' '}
                  </div>
                  {/* <div style={formRowStyle}> */}
                  <div>
                    <p>Select permission setting:</p>
                    <input type="radio" id="set-acl-perm-give" name="setAclPerms" value="Give" />
                    <label htmlFor="set-acl-perm-give">Give</label>
                    <br />
                    <input
                      type="radio"
                      id="set-acl-perm-revoke"
                      name="setAclPerms"
                      value="Revoke"
                    />
                    <label htmlFor="set-acl-perm-revoke">Revoke</label>
                  </div>
                  <button type="submit">Set Permission</button>
                </form>
                <StatusNotification
                  notification={state.message}
                  statusType="Permission status"
                  defaultMessage="Permission to be set..."
                  locationUrl={state.documentUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SetAclPermissionForm;
