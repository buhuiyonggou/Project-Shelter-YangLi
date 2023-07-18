import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import axios from "axios";
import ApplicationList from "./ApplicationList";

const MyApplication = ({ puppyId }) => {
  const { user, isAuthenticated, getAccessTokenSilently} = useAuth0();
  const [applications, setApplications] = useState([]);
  useEffect(() => {
    const fetchAdoptionStatus = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/myapplications`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setApplications(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchAdoptionStatus();
  }, [isAuthenticated, puppyId, getAccessTokenSilently, user]);

  return (
    <div className={'container'}>
      {applications.length === 0 && (
        <h2>No Applications Yet</h2>
      )}
      {applications.length > 0 && (
        <div>
          <ApplicationList applications={applications}/>
        </div>
      )}
    </div>
  );
};

export default MyApplication;