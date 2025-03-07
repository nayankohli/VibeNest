import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // For icons if needed (e.g. user profile)
import { faUser } from '@fortawesome/free-solid-svg-icons';      // Example icon
import useChatContext from "../../context/ChatProvider";
const UserListItem = ({ handleFunction }) => {
  const { user } = useChatContext();

  return (
    <div
      onClick={handleFunction}
      className="cursor-pointer bg-gray-200 hover:bg-teal-500 hover:text-white w-full flex items-center text-black px-3 py-2 mb-2 rounded-lg"
    >
      <div
        className="mr-2 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${user.pic})`, backgroundSize: 'cover' }}
      >
        {!user.pic && <FontAwesomeIcon icon={faUser} />} {/* Default user icon if no image */}
      </div>
      <div>
        <p className="font-semibold">{user.name}</p>
        <p className="text-xs">
          <b>Email : </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
