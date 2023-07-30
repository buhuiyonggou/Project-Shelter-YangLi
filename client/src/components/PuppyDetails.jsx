import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./Header/Header";

const PuppyDetails = () => {
  const { puppyId } = useParams();
  const [puppy, setPuppy] = useState(null);
  const [setApplied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();
  const [refresh] = useState(true);
  const [refreshFavorite, setRefreshFavorite] = useState(true);

  useEffect(() => {
    const fetchIsApplied = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/puppies/${puppyId}/is-applied`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response && response.data) {
          setApplied(true);
        } else {
          setApplied(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchIsApplied();
  }, [puppyId, refresh, setApplied, getAccessTokenSilently]);

  useEffect(() => {
    const fetchIsFavorite = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/myfavorite/${puppyId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response && response.data) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchIsFavorite();

  }, [puppyId, refreshFavorite, getAccessTokenSilently]);

  useEffect(() => {
    const fetchPuppy = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/details/${puppyId}`);
        console.log(response.data)
        setPuppy(response.data);
      } catch (error) {
        console.error("Error fetching puppy:", error);
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      }
    };

    fetchPuppy();
  }, [puppyId]);

  const sendApplication = () => {
    if (isAuthenticated) {
      navigate(`/dashboard/adoptionform/${puppyId}`);
    } else {
      loginWithRedirect().then(data => {
        console.log(data)
      }).catch(err => {
        console.log(err);
      })
    }
  };

  const addToFavorites = async () => {
    if (isAuthenticated) {
      try {
        const accessToken = await getAccessTokenSilently();

        await axios.post(`${process.env.REACT_APP_API_URL}/myfavorite`, {
          puppyId: puppyId
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setRefreshFavorite(!refreshFavorite);
      } catch (error) {
        console.error(error);
      }
    } else {
      loginWithRedirect().then(data => {
        console.log(data)
      }).catch(err => {
        console.log(err);
      })
    }
  };

  const removeFromFavorite = async () => {
    if (isAuthenticated) {
      try {
        const accessToken = await getAccessTokenSilently();

        await axios.delete(`${process.env.REACT_APP_API_URL}/myfavorite/${puppyId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setRefreshFavorite(!refreshFavorite);
      } catch (error) {
        console.error(error);
      }
    } else {
      loginWithRedirect().then(data => {
        console.log(data)
      }).catch(err => {
        console.log(err);
      })
    }
  }

  return (
    <div>
      <Header />
      {puppy && (
        <div className={'paper'} style={{margin: '10px'}}>
          <div className={'row'}>
            <div className={'col-5 col-s-12'}>
              <img src={puppy.image} width={'90%'} alt='puppy'/>
            </div>
            <div className={'col-5 col-s-12'}>
              <h1>{puppy.name}</h1>
              <p>Breed: {puppy.breed}</p>
              <p>Age: {puppy.age}</p>
              {!puppy.adopter && (
                <button className={'button button-blue mr-1'} onClick={sendApplication}>Send Application</button>
              )}
              {puppy.adopter && puppy.adopter.auth0Id === user?.sub && (
                <button className={'button button-light'}>You have adopted!</button>
              )}
              {puppy.adopter && puppy.adopter.auth0Id !== user?.sub && (
                <button className={'button button-light'}>It has been adopted!</button>
              )}
              <p>Description: {puppy.description}</p>
              {isAuthenticated && (
                <div>
                  {!isFavorite && (
                    <button className={'button button-orange'} onClick={addToFavorites}>Add to My Favorite</button>
                  )}
                  {isFavorite && (
                    <button className={'button button-light'} onClick={removeFromFavorite}>Remove from My Favorite</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PuppyDetails;