import renderer from "react-test-renderer"
import React from 'react';
import { expect, it } from 'vitest';
import OidcLoginComponent from "../../../src/components/NavBar/OidcLoginComponent";

const render = (jsx) => (renderer.create(jsx).toJSON());

it('renders correctly', () => {
  const component = render(<OidcLoginComponent/>)
  expect(component).toMatchSnapshot();
});
