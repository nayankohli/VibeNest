const UserListItem = ({ user, handleFunction }) => {
    if (!user) return null; // Prevents rendering if user is undefined
  
    return (
      <div
        onClick={handleFunction}
        className="cursor-pointer flex items-center w-full px-3 py-2 mb-2 bg-gray-200 rounded-lg hover:bg-teal-500 hover:text-white transition"
      >
        <img
          src={user?.profileImage || "/default-avatar.png"} // Handle missing image
          alt={user?.name || "User"}
          className="w-8 h-8 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold">{user?.name || "Unknown"}</p>
          <p className="text-xs">
            <b>Email:</b> {user?.email || "No Email"}
          </p>
        </div>
      </div>
    );
  };
  
  export default UserListItem;
  