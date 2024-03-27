import React from 'react';
import { render, screen } from '@testing-library/react';
import Prefectures from '../components/Prefectures';

test('renders learn react link', () => {
  render(<Prefectures />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
