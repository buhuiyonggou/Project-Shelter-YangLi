import './index.css';
import './components/style/common.css';

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ReactDOM from 'react-dom/client';

import Entry from './components/Home/Home';
import Dashboard from './components/Dashboard';
import LoginLayout from "./components/LoginLayout";
import Puppies from "./components/Puppies";
import PuppyDetails from "./components/PuppyDetails";
import Profile from "./components/Profile/Profile";
import MyApplication from "./components/MyApplication";
import MyAdoptions from "./components/MyAdoptions";
import AdoptionForm from './components/AdoptionForm';
import MyFavoritePuppies from "./components/MyFavoritePuppies";
import NotFound from "./components/NotFound";
import VerifyUser from "./components/VerifyUser";
import AuthDebugger from "./components/AuthDebugger/AuthDebugger";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import DashboardMenu from "./components/DashboardMenu";


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


function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Entry />} />
            <Route path="login" element={<LoginLayout />} />
            <Route path="puppies" element={<Puppies />} />
            <Route path="details/:puppyId" element={<PuppyDetails />} />
            <Route path="/verify-user" element={<VerifyUser />}/>
            <Route path="dashboard/*" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>}>
              <Route path={''} element={<DashboardMenu />} />
              <Route path="profile" element={<Profile />} />
              <Route path="myapplications" element={<MyApplication />} />
              <Route path="myadoptions" element={<MyAdoptions />} />
              <Route path="adoptionform/:puppyId" element={<AdoptionForm />} />
              <Route path="myfavorite" element={<MyFavoritePuppies />} />
              <Route path="debugger" element={<AuthDebugger />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);