import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('checks for Home side menu link', () => {
  render(<App />);
  const menu_item_element = screen.getByText(/Home/i);
  expect(menu_item_element).toBeInTheDocument();
});
