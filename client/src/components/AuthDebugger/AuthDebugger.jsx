import './debugger.css';

import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../../AuthTokenContext";

//auth debugger page for login clients to check if authentication is correct
export default function AuthDebugger() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();

  return (
    <div className="debugger-container">
      <div className="token">
        <p>Access Token:</p>
        <pre>{JSON.stringify(accessToken, null, 2)}</pre>
      </div>
      <div className="userInfo">
        <p>User Info:</p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}







