import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // Import FontAwesomeIcon
import { faTimes } from '@fortawesome/free-solid-svg-icons';      // Import the specific icon

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <div
      className="px-2 py-1 rounded-lg m-1 mb-2 bg-purple-500 text-white text-sm cursor-pointer flex items-center"
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <FontAwesomeIcon icon={faTimes} className="pl-1" />  {/* Use FontAwesomeIcon for close */}
    </div>
  );
};

export default UserBadgeItem;
