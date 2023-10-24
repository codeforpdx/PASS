import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import { expect, it, describe } from 'vitest';
import { FormLayout, PERSONAL_FORM_LIST } from '@components/PersonalProfileForms';

const renderLayout = (route) =>
  render(
    <Router initialEntries={[`/${route}`]}>
      <FormLayout />
    </Router>
  );

describe('Personal Form Layout', () => {
  it('creates a next button that navigates to the next element in the Personal list', () => {
    const [firstRoute, secondRoute] = PERSONAL_FORM_LIST;
    const { getByRole } = renderLayout(firstRoute.path);
    expect(getByRole('link').getAttribute('href')).toBe(`/${secondRoute.path}`);
  });
  it('creates a prev button that navigates to the previous element in the Personal list', () => {
    const lastRoute = PERSONAL_FORM_LIST[PERSONAL_FORM_LIST.length - 1];
    const prevRoute = PERSONAL_FORM_LIST[PERSONAL_FORM_LIST.length - 2];
    const { getByRole } = renderLayout(lastRoute.path);
    expect(getByRole('link').getAttribute('href')).toBe(`/${prevRoute.path}`);
  });
  it('does not create a next button on the last page', () => {
    const [firstRoute, secondRoute] = PERSONAL_FORM_LIST;
    const { queryAllByRole } = renderLayout(firstRoute.path);
    expect(queryAllByRole('link').length).toEqual(1);
    expect(queryAllByRole('link')[0].getAttribute('href')).toBe(`/${secondRoute.path}`);
  });
  it('does not create a prev button on the first page', () => {
    const lastRoute = PERSONAL_FORM_LIST[PERSONAL_FORM_LIST.length - 1];
    const prevRoute = PERSONAL_FORM_LIST[PERSONAL_FORM_LIST.length - 2];
    const { queryAllByRole } = renderLayout(lastRoute.path);
    expect(queryAllByRole('link').length).toEqual(1);
    expect(queryAllByRole('link')[0].getAttribute('href')).toBe(`/${prevRoute.path}`);
  });
});
