import { render, screen } from '@testing-library/react';
import { useAuth0 } from "@auth0/auth0-react";
import AuthDebugger from '../AuthDebugger';

// mock user authentication
const user = {
  email: "testuser@test.com",
  email_verified: true,
  sub: "google-oauth2|12345678901234",
};

const accessToken = "1234567890abcdef";

jest.mock("@auth0/auth0-react");
jest.mock("../../../AuthTokenContext");

describe('AuthDebugger', () => {
  it('renders AuthDebugger with mocked data', () => {
    useAuth0.mockReturnValue({
      user,
    });

    require("../../../AuthTokenContext").useAuthToken.mockReturnValue({
      accessToken,
    });
    
    render(
      <AuthDebugger />
    );
    
    expect(screen.getByText('Access Token:')).toBeInTheDocument();
    expect(screen.getByText(accessToken, { exact: false })).toBeInTheDocument();
    expect(screen.getByText('User Info:')).toBeInTheDocument();
    
    expect(screen.getByText(user.email, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(user.sub, { exact: false })).toBeInTheDocument();
  });
});
