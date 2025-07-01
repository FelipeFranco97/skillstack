import React from 'react';
import { render, screen } from '@testing-library/react';

function Hello() {
  return <h1>Hola, Mundo</h1>;
}

test('muestra el saludo', () => {
  render(<Hello />);
  const saludo = screen.getByText(/Hola, Mundo/i);
  expect(saludo).toBeInTheDocument();
});
