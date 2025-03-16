const UserBadgeItem = ({ user, handleFunction, admin }) => {
    return (
      <div
        className="inline-flex items-center px-2 py-1 m-1 mb-2 text-sm font-semibold text-white bg-purple-600 rounded-lg cursor-pointer hover:bg-purple-700 transition"
        onClick={handleFunction}
      >
        {user.name}
        {admin === user._id && <span className="ml-1">(Admin)</span>}
        <button className="ml-2 text-white hover:text-gray-300">&times;</button>
      </div>
    );
  };
  
  export default UserBadgeItem;
  