import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
const RightSidebar = () => {
  // Dummy data for suggestions
  const {suggestedUsers} =useSelector((store) => store.auth);
  const { userInfo } = useSelector((state) => state.userLogin);
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";  // Dummy news articles
  const newsArticles = [
    { title: "Ten questions you should answer truthfully", time: "2hr" },
    { title: "Five unbelievable facts about money", time: "" },
  ];

  return (
    <div className="w-80 space-y-6">
      {/* Who to Follow Section */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="text-2xl font-bold  mb-3">Who to follow</h2>
        <div className="space-y-3">
          {suggestedUsers.map((user, index) => (
            <div className="flex items-center justify-between">
            {/* Profile Image */}
            <div className="flex items-center space-x-3">
              <img
                src={user?.profileImage ? `http://localhost:5000${user.profileImage}` : defaultProfileImage}
                alt={user.name}
                className={`w-12 h-12 rounded-full object-cover ${
                  userInfo.following.includes(user._id) ? "border-2 border-blue-600 p-0.5" : ""
                }`}
              />
              <div>
                <h4 className="font-medium text-lg">{user.username}</h4>
                <p className="text-sm text-gray-500">{user.jobProfile}</p>
              </div>
            </div>
            {/* Follow Button */}
            <button
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                userInfo.following.includes(user._id) ? "bg-green-600 text-white" : "bg-green-100 text-green-700"
              }`}
            >
              {userInfo.following.includes(user._id) ? <FaUserCheck size={18} /> : <FaUserPlus size={18} />}
            </button>
          </div>
          ))}
        </div>
        <button className="w-full text-green-600 font-normal bg-green-100 mt-3 py-2 hover:bg-green-600 hover:text-white ">
          View more
        </button>
      </div>

      {/* Today's News Section */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="text-2xl font-bold mb-3 ">Today's news</h2>
        <div className="space-y-2">
          {newsArticles.map((article, index) => (
            <NewsItem key={index} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};



// News Item Component
const NewsItem = ({ article }) => (
  <div>
    <h4 className="text-sm font-medium hover:underline cursor-pointer">{article.title}</h4>
    {article.time && <p className="text-xs text-gray-500">{article.time}</p>}
  </div>
);

export default RightSidebar;
