import './profile.css';
import { useAuth0 } from "@auth0/auth0-react";
import {useEffect, useState} from "react";
import axios from "axios";
import MyFavoritePuppies from "../MyFavoritePuppies";
import MyAdoptions from "../MyAdoptions";

export default function Profile() {
  const { getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [formStatus, setFormStatus] = useState('read');

  const handleSubmit = async () => {
    const accessToken = await getAccessTokenSilently();
    await axios.put(`${process.env.REACT_APP_API_URL}/me`, {
      ...profile
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    alert("Update successfully!");
    setFormStatus('read');
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      setProfile(response.data);
    }
    fetchProfile();
  }, [getAccessTokenSilently]);

  if (!profile) {
    return <div>Sorry, can't find the Profile...</div>;
  }

  return (
    <div className='profile-container'>
      <div className='paper' style={{ margin: '15px' }}>
        <h2>Profile</h2>
        <div className="flex-container">
          <div className="h4-input-container">
            <h4>📧Email</h4>
            <p>{profile.email}</p>
          </div>
          <div className="h4-input-container">
            <h4>📛Name</h4>
            <p>
              <input
                onChange={e => { setProfile({...profile, name: e.target.value}) }}
                className='textfield' value={profile.name} disabled={formStatus === 'read'}/>
            </p>
          </div>
          <div className="h4-input-container">
            <h4>📱Phone </h4>
            <input
              onChange={e => { setProfile({...profile, phone: e.target.value}) }}
              placeholder={profile.phone || 'N/A'}
              className='textfield' value={profile.phone} disabled={formStatus === 'read'}/>
          </div>
        </div>
        
        <div className="flex-container">
          <div className="h4-input-container">
            <h4> 🏘️Address</h4>
            <input
              onChange={e => { setProfile({...profile, address: e.target.value}) }}
              placeholder={profile.address || 'N/A'}
              className='textfield' value={profile.address} disabled={formStatus === 'read'}/>
          </div>
          <div className="h4-input-container">
            <h4>🤖Occupation</h4>
            <input
              onChange={e => { setProfile({...profile, occupation: e.target.value}) }}
              placeholder={profile.occupation || 'N/A'}
              className='textfield' value={profile.occupation} disabled={formStatus === 'read'}/>
          </div>
        </div>
        
        <div className="textarea-container">
          <h4>🐶Reason For Adopt</h4>
          <textarea
            onChange={e => { setProfile({...profile, reasonForAdopt: e.target.value}) }}
            placeholder={profile.reasonForAdopt || 'N/A'}
            className='textfield textarea' value={profile.reasonForAdopt} disabled={formStatus === 'read'}/>
        </div>

        {formStatus === 'read' && (
            <button
              style={{ marginLeft: '25px' }}
              onClick={() => { setFormStatus('write'); }}
              className='button button-blue'>Update</button>
          )}
        {formStatus === 'write' && (
          <div className='mt-1'>
            <button
              onClick={handleSubmit}
              className='button button-blue mr-1'>Submit</button>
            <button
              onClick={() => { setFormStatus('read') }}
              className='button button-light'>Cancel</button>
          </div>
        )}
        <div className="separation-line"></div>
        <h2>Favorites</h2>
        <MyFavoritePuppies />
        <div className="separation-line"></div>
        <h2>Adopted</h2>
        <MyAdoptions />
      </div>
    </div>
  );
}
