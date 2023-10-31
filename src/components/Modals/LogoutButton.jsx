/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { useContext } from 'react';
import { SessionContext } from '@contexts';

const LogoutButton = ({ children, onLogout, onError }) => {
  const { logout } = useContext(SessionContext);

  const logoutHandler = async () => {
    try {
      await logout();
      if (onLogout) onLogout();
    } catch (error) {
      if (onError) onError(error);
    }
  };

  const keyDownHandler = (e) => {
    e.preventDefault();

    return e.key === 'Enter' ? logoutHandler() : Promise.resolve();
  };

  return children ? (
    <div
      role="button"
      tabIndex={0}
      onClick={logoutHandler}
      onKeyDown={keyDownHandler}
      style={{ width: '100%' }}
    >
      {children}
    </div>
  ) : (
    <button type="button" onClick={logoutHandler} onKeyDown={keyDownHandler}>
      Log Out
    </button>
  );
};

export default LogoutButton;
