import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import PuppiesList from "./PuppyList/PuppiesList";

const Puppies = () => {
  const [puppies, setPuppies] = useState([]);

  useEffect(() => {
    const fetchPuppies = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/puppies`);
        setPuppies(response.data);
      } catch (error) {
        console.error('Error fetching puppies:', error);
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      }
    };
  
    fetchPuppies();
  }, []);
  
  return (
    <div className={'container'}>
      <Header />
      <PuppiesList puppies={puppies}/>
  </div>
  );
};

export default Puppies;