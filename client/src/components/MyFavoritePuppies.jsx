import { useAuth0 } from "@auth0/auth0-react";
import {useEffect, useState} from "react";
import axios from "axios";
import FavoritesList from "./FavoritesList";

const MyFavoritePuppies = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
      const fetchFavorites = async () => {
        const accessToken = await getAccessTokenSilently();
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/myfavorite`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
        if (response && response.data) {
          setFavorites(response.data);
        }
      }
      fetchFavorites()
  }, [getAccessTokenSilently])

  if (favorites.length === 0) {
    return <div className={'paper'} style={{margin: '20px'}}>
      <h4>No Data</h4>
    </div>
  }
  
  return (
    <div>
      <FavoritesList favorites={favorites}/>
    </div>
  );
};

export default MyFavoritePuppies;