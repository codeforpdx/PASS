import React, { useState } from 'react';
import { useSession, LogoutButton } from '@inrupt/solid-ui-react';

/**
 * Logout Component - Component that generates Logout section for users to a
 * Solid Pod via Solid Session
 *
 * @memberof Login
 * @name Logout
 */

const Logout = () => {
  const { session } = useSession();
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <section id="logout" className="panel">
      <div className="row">
        <label id="labelLogout" htmlFor="btnLogout">
          Click the following logout button to log out of your pod:{' '}
        </label>
        <button type="submit" onClick={() => setShowConfirmation(true)}>
          Logout
        </button>
        {showConfirmation ? (
          <div>
            <p>Are you sure you want to log out?</p>
            <LogoutButton>
              <button>Yes</button>
            </LogoutButton>
            <button onClick={() => setShowConfirmation(false)}>No</button>
          </div>
        ) : (
          <p></p>
        )}
        <p className="labelStatus" role="alert">
          Your session is now logged in with the WebID [
          <a href={session.info.webId} target="_blank" rel="noreferrer">
            {session.info.webId}
          </a>
          ].
        </p>
      </div>
    </section>
  );
};

export default Logout;

// const Logout = () => {
//   const { session } = useSession();
//   const [showConfirmation, setShowConfirmation] = useState(false);

//   const handleLogout = () => {
//     setShowConfirmation(true);
//   };

//   const confirmLogout = () => {
//     LogoutButton.handleLogout();
//   };

//   return (
//     <section id="logout" className="panel">
//       <div className="row">
//         <label id="labelLogout" htmlFor="btnLogout">
//           Click the following logout button to log out of your pod:{' '}
//         </label>
//         {showConfirmation ? (
//           <div>
//             <p>Are you sure you want to log out?</p>
//             <button onClick={confirmLogout}>Yes</button>
//             <button onClick={() => setShowConfirmation(false)}>No</button>
//           </div>
//         ) : (
//           <LogoutButton>
//             <button type="submit" onClick={handleLogout}>
//               Logout
//             </button>
//           </LogoutButton>
//         )}
//         <p className="labelStatus" role="alert">
//           Your session is now logged in with the WebID [
//           <a href={session.info.webId} target="_blank" rel="noreferrer">
//             {session.info.webId}
//           </a>
//           ].
//         </p>
//       </div>
//     </section>
//   );
// };

// export default Logout;
