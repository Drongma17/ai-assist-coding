import './user.css';

function User({name, avatarUrl}){
  return (
    <div className="user-profile">
      <img src={avatarUrl} alt={`${name}'s avatar`} className="user-profile_avatar" />
      <h2 data-testid="user-profile_name" className="user-profile_name">
        {name}
      </h2>
    </div>
  );
}

export default User;