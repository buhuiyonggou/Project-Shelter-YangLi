import {Link} from "react-router-dom";


export default function ApplicationList({applications}) {
  return (
    <div className={'row p-1 center-row'} >
      {applications.map((application) => {
        const puppy = application.puppy;
        return (
          <div  key={puppy.id} className={'col-4 col-s-12 paper mt-1'}>
            <div className={'row'}>
              <div className={'col-5 col-s-12'}>
                <img
                  alt={'application img'}
                  width={'100%'}
                  className={'round'}
                  src={puppy.image}/>
              </div>
              <div className={'col-5 col-s-12'}>
                <div className="info-container">
                  <h2>
                    {puppy.name}
                  </h2>
                  <p>
                    Age: <span>{puppy.age}</span> Years
                  </p>
                  <p>
                    Breed: <span>{puppy.breed}</span>
                  </p>
                  <Link to={`/details/${puppy.id}`}>
                    <button className={'button button-blue'}>
                      Click to see more
                    </button>
                  </Link>
                </div>
              </div>
              <div className={'col-12 col-s-12'}>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}