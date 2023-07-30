import ProfileIcon from "../assets/images/PROFILE.png";
import ApplicationIcon from "../assets/images/application.png";
import AdoptionIcon from "../assets/images/Adoption.png";
import FavoriteIcon from "../assets/images/Favorite I.png";
import {useNavigate} from "react-router-dom";


export default function DashboardMenu() {
  const navigate = useNavigate();
  return (
    <div className={'row'} style={{padding: '15px', overflow:'hidden'}}>
      <div onClick={() => {
        navigate('/dashboard/profile')
      }} className={'col-3 col-s-12'}>
        <div style={{
          background: '#409eff',
          color: 'white'
        }} className={'paper flex flex-column ai-c'}>
          <img src={ProfileIcon} width={'50%'} alt="profile"/>
          <h1>Profile</h1>
        </div>
      </div>

      <div onClick={() => {
        navigate('/dashboard/myapplications')
      }}  className={'col-3 col-s-12'}>
        <div style={{
          background: '#06f8d4',
          color: 'white'
        }} className={'paper flex flex-column ai-c'}>
          <img src={ApplicationIcon} width={'50%'} alt="application icon"/>
          <h1>Applications</h1>
        </div>
      </div>

      <div
        onClick={() => {
          navigate('/dashboard/myadoptions')
        }}
        className={'col-3 col-s-12'}>
        <div style={{
          background: '#f53434',
          color: 'white'
        }} className={'paper flex flex-column ai-c'}>
          <img src={AdoptionIcon} width={'50%'} alt="adoption icon"/>
          <h1>Adoptions</h1>
        </div>
      </div>

      <div
        onClick={() => {
          navigate('/dashboard/myfavorite')
        }}
        className={'col-3 col-s-12'}>
        <div style={{
          background: '#fa8e8e',
          color: 'white'
        }} className={'paper flex flex-column ai-c'}>
          <img src={FavoriteIcon} width={'50%'} alt="favorite icon"/>
          <h1>Favorites</h1>
        </div>
      </div>
    </div>
  )
}