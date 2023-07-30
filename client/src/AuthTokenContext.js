import React, { useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AuthTokenContext = React.createContext();

const requestedScopes = [
  "openid",
  "profile",
  "email",
  "read:user",
  "edit:user",
  "delete:user",
  "write:user",
  "read:puppy",
  "edit:puppy",
  "delete:puppy",
  "write:puppy",
  "read:application",
  "edit:application",
  "delete:application",
  "write:application",
  "read:adoption",
  "edit:adoption",
  "delete:adoption",
  "write:adoption",
  "read:favorite",
  "edit:favorite",
  "delete:favorite",
  "write:favorite",
];

function AuthTokenProvider({ children }) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: requestedScopes.join(' ')
          },
        });

        setAccessToken(token);
      } catch (err) {
        console.log(err);
      }
    };

    if (isAuthenticated) {
      getAccessToken();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  const value = { accessToken, setAccessToken };
  return (
    <AuthTokenContext.Provider value={value}>
      {children}
    </AuthTokenContext.Provider>
  );
}

const useAuthToken = () => useContext(AuthTokenContext);

export { useAuthToken, AuthTokenProvider };
