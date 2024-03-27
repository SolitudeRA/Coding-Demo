import React from 'react';
import { render, screen } from '@testing-library/react';
import Prefecture from '../components/Prefectures';

test('renders learn react link', () => {
  render(<Prefecture />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
