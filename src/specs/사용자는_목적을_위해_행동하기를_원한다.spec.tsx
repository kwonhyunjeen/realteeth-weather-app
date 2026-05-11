import { screen } from '@testing-library/react';

import { renderApp } from './render';

describe('사용자는_목적을_위해_행동하기를_원한다', () => {
  it('페이지의 제목이 표시되어야 한다', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: 'Weather App' })).toBeVisible();
  });
});
