import './puppyList.css';
import {Link} from "react-router-dom";

function Puppy({ puppy }) {
  return (
    <div key={puppy.id} className='col-6 col-s-12 paper mt-1'>
      <div className='puppy-row'>
        <div className='col-6 col-s-12 puppyimg-container'>
          <img width='100%' className='round' src={puppy.image} alt="puppy img"/>
        </div>
        <div className='col-6 col-s-12 info-container'>
            <h2>{puppy.name}</h2>
            <p>Age: <span>{puppy.age}</span> Years</p>
            <p>Breed: <span>{puppy.breed}</span></p>
            <Link to={`/details/${puppy.id}`}>
              <button className='button button-blue'>
                Click to see more
              </button>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default function PuppiesList({puppies}) {
  return (
    <div className='row p-1'>
      {puppies.map((puppy) => <Puppy key={puppy.id} puppy={puppy} />)}
    </div>
  );
}

