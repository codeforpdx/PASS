// React Imports
import React from 'react';

/**
 * Main component represents the main content area
 *
 * @name Main
 * @param {object} props - The properties of the component
 * @param {React.JSX.Element} [props.children] - The child elements to be rendered inside the main content area
 * @returns {React.JSX.Element} The rendered main content area
 */
const Main = ({ children }) => <main id="main-content">{children}</main>;

export default Main;
