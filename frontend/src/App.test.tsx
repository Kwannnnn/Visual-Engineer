import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

render(<App />);

test('renders button', () => {
  const buttonElement = screen.getByText(/Read Data/i);
  expect(buttonElement).toBeInTheDocument();
});
