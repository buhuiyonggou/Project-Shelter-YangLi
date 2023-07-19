import './header.css';

import { Link } from "react-router-dom";
import MobileMenu from "../MobileMenu";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

export default function Header() {
  const { user, isLoading, logout } = useAuth0();
  const [menuOpen, setMenuOpen] = useState(false);

  const userLinks = [
    { to: "/dashboard/profile", text: "Profile" },
    { to: "/dashboard/myapplications", text: "My Applications" },
    { to: "/dashboard/myfavorite", text: "My Favorite Puppies" },
    { to: "/dashboard/myadoptions", text: "My Adoptions" },
    { to: "/dashboard/debugger", text: "Auth Debugger" }
  ];

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className='bg-orange text-white flex jc-sb ai-c'>
      <div className="header-content">
        <h1>
          Welcome to Puppy Adoption Center!
        </h1>

        <div className="nav-items" style={{
          height: menuOpen ? 'auto' : '0px',
          overflow: 'hidden',
          transition: '0.3s'
        }}>
          <p>
            <Link to="/puppies">
              <button className='button button-blue'>Puppies</button>
            </Link>
          </p>

          {!user && (
            <p>
              <Link to="/dashboard">
                <button className='button button-blue'>Login</button>
              </Link>
            </p>
          )}

          {user && userLinks.map(link => (
            <p key={link.to}>
              <Link to={link.to}>
                <button className='button button-blue'>{link.text}</button>
              </Link>
            </p>
          ))}
          {user && (
            <p>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className='button button-light'>LogOut</button>
            </p>
          )}
        </div>
      </div>

      <div className='d-none'
        style={{ alignSelf: 'flex-start' }}
        onClick={() => { setMenuOpen(!menuOpen) }}>
        <MobileMenu />
      </div>

      <ul className='d-s-none d-flex' style={{ listStyle: 'none', margin: '0' }}>
        <li className='mr-1'>
          <Link to="/puppies">
            <button className='button button-blue'>Puppies</button>
          </Link>
        </li>

        {!user && (
          <li className='mr-1'>
            <Link to="/dashboard">
              <button className='button button-blue'>Login</button>
            </Link>
          </li>
        )}

        {user && userLinks.map(link => (
          <li key={link.to} className='mr-1'>
            <Link to={link.to}>
              <button className='button button-blue'>{link.text}</button>
            </Link>
          </li>
        ))}
        {user && (
          <li className='mr-1'>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className='button button-light'>LogOut</button>
          </li>
        )}
      </ul>
    </div>
  );
}
