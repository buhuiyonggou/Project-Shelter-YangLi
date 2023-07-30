import { useAuth0 } from "@auth0/auth0-react";
import {useEffect, useState} from "react";
import axios from "axios";
import PuppiesList from "./PuppyList/PuppiesList";

const MyAdoptions = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [puppies, setPuppies] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/myadoptions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if (response && response.data) {
        setPuppies(response.data);
      }
    }
    fetchFavorites()
  }, [getAccessTokenSilently])

  return (
    <div>
      <PuppiesList puppies={puppies}/>
    </div>
  );
};

export default MyAdoptions;