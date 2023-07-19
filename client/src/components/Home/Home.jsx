import './home.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import VideoCarousel from '../VideoCarousel/VideoCarousel';

function Home() {
  const { user, isAuthenticated } = useAuth0();
  const [videoIds, setVideoIds] = useState([]);  

  useEffect(() => {
    fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UC7JBG8BXxqTgu6jpeJikImQ&maxResults=5&key=AIzaSyBvB8S03KRxNVscvlNMLMlMrpM7THvVpyc`)
    .then((result) => {
        return result.json(); 
    })
    .then((data) => {
        const ids = data.items.map(item => item.id.videoId);
        setVideoIds(ids);
    })
    .catch((error) => {
        console.log(error);
    });
  }, []);

  return (
    <div className={'home-container'}>
      <h1 className={'text-center bg-orange text-white'}>Welcome to Puppy Adoption Center!</h1>
      <div className={'row flex jc-c'}>
        <div className={'wallpaper col-6 col-s-10'}>
          <div className={'introduction'}>
            <h1>The North Eastern Shelter</h1>
            <div className='contact-info'>
              <p>Phone: 204 123 4567</p> 
              <p>Address: 410 W Georgia St #1400, Vancouver</p>
            </div>
            {!isAuthenticated ? (<div>
              <Link to="/dashboard">
                <button className={'button button-blue'}>
                  Login
                </button>
              </Link> 
              <strong className={'instruction'}>
              <i>
                to start the adoption process.
              </i>
              </strong>
            </div>) : 
              (<div className='goProfile'>
              {user && (
                <div>  
                  <p className='user-greeting'>Welcome, {user.name}!</p>
                  <div>
                    <Link to="/dashboard">Go to MyProfile</Link>
                  </div>
                </div>
              )}
            </div>
            )}
            <div className={'available-puppies'}>
              <Link to="/puppies">See Available Puppies</Link>
            </div>
          </div>
          <div className="video-container">
              <p>See our videos here: </p>
            <VideoCarousel videoIds={videoIds} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;