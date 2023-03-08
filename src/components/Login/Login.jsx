import { useSession, LoginButton, LogoutButton } from '@inrupt/solid-ui-react';
import React, { useState, useEffect } from 'react';
import { SOLID_IDENTITY_PROVIDER } from '../../utils';

const Login = () => {
	const { session } = useSession();
	const [currentUrl, setCurrentUrl] = useState('http://localhost:3000');

	useEffect(() => {
		setCurrentUrl(window.location.href);
	}, [setCurrentUrl]);
	return (
		<section id="login" className="panel">
			<div className="row">
				<label id="labelLogin" htmlFor="btnLogin">
					Click the following login button to log into your pod at [
					<a href={SOLID_IDENTITY_PROVIDER} target="_blank">
						{SOLID_IDENTITY_PROVIDER}
					</a>
					]:{' '}
				</label>
				{!session.info.isLoggedIn ? (
					<LoginButton
						oidcIssuer={SOLID_IDENTITY_PROVIDER}
						redirectUrl={currentUrl}
						onError={console.error}>
						<button type="button">Login</button>
					</LoginButton>
				) : (
					<LogoutButton>
						<button type="button">Logout</button>
					</LogoutButton>
				)}
				{session.info.isLoggedIn ? (
					<p className="labelStatus" role="alert">
						Your session is logged in with the WebID [
						<a href={session.info.webId} target="_blank">
							{session.info.webId}
						</a>
						].
					</p>
				) : (
					<p>Not logged in</p>
				)}
			</div>
		</section>
	);
};

export default Login;
