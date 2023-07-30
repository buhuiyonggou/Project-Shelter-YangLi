import {Outlet} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./Header/Header";

//component of dashboard for login clients
export default function Dashboard() {
  const { isLoading} = useAuth0();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <Header />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}