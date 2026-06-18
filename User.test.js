import {render, screen} from '@testing-library/react';
import User from './User';

test('renders user name', () => {
  const user = {name: 'John Doe'};
  render(<User user={user} />);
  const nameElement = screen.getByTestId('user-card-name');
  expect(nameElement).toHaveTextContent('John Doe');
});