import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";
import PetIcon from '../assets/images/pet-icon.jpg';
export default function LoginLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const login = () => {
    loginWithRedirect({
      appState: { returnTo: location.pathname }
    }).catch(error => {
      console.error("Error during login: ", error);
    });
  };

  const signUp = () => {
    loginWithRedirect({ screen_hint: "signup" }).catch(error => {
      console.error("Error during signup: ", error);
    });
  };

  return (
    <div className="container flex flex-column ai-c">
      <h1 className={'text-center text-orange'}>Login to find your pets!</h1>
      <div>
        {!isAuthenticated ? (
          <div>
            <button
              className="button button-blue button-large mr-1" onClick={login}>
              Login
            </button>
            <button className="button button-orange button-large" onClick={signUp}>
              Sign Up
            </button>
          </div>
        ) : (
          <button className="btn-primary" onClick={() => navigate("/")}>
            Go find your puppies
          </button>
        )}
      </div>
      <div className={'petIcon'}>
          <img src={PetIcon} width={'100%'} alt="pet img"/>
        </div>
    </div>
  );
}