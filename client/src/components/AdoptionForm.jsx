import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";

const AdoptionForm = () => {
  const { puppyId } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const [form, setForm] = useState({
    address: '',
    phone: '',
    occupation: '',
    reasonForAdopt: '',
  });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accessToken = await getAccessTokenSilently();
      await axios.post(`${process.env.REACT_APP_API_URL}/myapplications`, {
        puppyId,
        ...form
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      navigate(`/details/${puppyId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={'row flex jc-c'}>
      <div className={'col-5 col-s-12'}>
        <div className={'paper'} style={{margin: '10px'}}>
          <h3>Send Application</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <h4>
                Address:
              </h4>
              <input
                required
                type="text" name="address" className={'textfield w-90'} value={form.address} onChange={handleChange} />
            </div>

            <div>
              <h4>
                Phone:
              </h4>
              <input
                required
                type="text" name="phone" className={'textfield w-90'} value={form.phone} onChange={handleChange} />
            </div>

            <div>
              <h4>
                Occupation:
              </h4>
              <input
                required
                type="text" name="occupation"  className={'textfield w-90'}  value={form.occupation} onChange={handleChange} />
            </div>

            <div>
              <h4>
                Reason for Adoption:
              </h4>
              <textarea
                required
                rows={4}
                name="reasonForAdopt"  className={'textfield w-90'}  value={form.reasonForAdopt} onChange={handleChange} />
            </div>

            <input className={'button button-blue mt-1'} type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdoptionForm;