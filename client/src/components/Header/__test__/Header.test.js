import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Header from '../Header.jsx';

jest.mock("@auth0/auth0-react");

describe('Header', () => {
  it('renders loading state', () => {
    useAuth0.mockReturnValue({
      isLoading: true,
    });
  
    render(
      <Router>
        <Header />
      </Router>
    );
  
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});