import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faBriefcase, faLocationDot, faEnvelope, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ThemeContext } from "../../../../context/ThemeContext";

const AboutSection = ({ profile, loggedInUserId }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const isOwner = profile?._id === loggedInUserId;
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();
  
  const handleEditClick = () => {
    navigate("/edit-profile");
  };

  const toggleDropdown = (field) => {
    setDropdownOpen(dropdownOpen === field ? null : field);
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md  ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <h2 className="text-xl font-bold mb-4">Profile Info</h2>

      <div className={`p-3 ${isDarkMode ? 'bg-gray-700 border' : 'bg-gray-100'} rounded-md relative`}>
        <h3 className="text-md font-semibold mb-2">Overview</h3>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {profile.bio || (isOwner ? "Add a bio to let others know about you." : "")}
        </p>
        {isOwner && (
          <button onClick={() => toggleDropdown("bio")} className={`absolute top-3 right-3 ${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-800'}`}>•••</button>
        )}
        {dropdownOpen === "bio" && (
          <div className={`absolute right-3 top-10 ${isDarkMode ? 'bg-gray-800 border' : 'bg-white'} shadow-md rounded-md p-2`}>
            <button onClick={handleEditClick} className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}>✏️ Edit</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {profile.dob ? (
          <div className={`p-3 ${isDarkMode ? 'border-gray-700 border' : 'border'} rounded-md flex justify-between items-center relative ${isDarkMode ? 'bg-gray-700' : ''}`}>
            <div>
              <FontAwesomeIcon icon={faCalendar} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
              <span>Born: <strong>{format(new Date(profile.dob), "dd MMMM yyyy")}</strong></span>
            </div>
            {isOwner && (
              <button onClick={() => toggleDropdown("dob")} className={`${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-800'}`}>•••</button>
            )}
            {dropdownOpen === "dob" && (
              <div className={`absolute right-3 top-10 ${isDarkMode ? 'bg-gray-800 border' : 'bg-white'} shadow-md rounded-md p-2`}>
                <button onClick={handleEditClick} className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}>✏️ Edit</button>
              </div>
            )}
          </div>
        ) : (
          isOwner && (
            <button className={`w-full ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border text-gray-500 hover:bg-gray-100'} p-3 rounded-md flex items-center justify-center`} onClick={handleEditClick}>
              ➕ Add your birth date
            </button>
          )
        )}

        {profile.gender ? (
          <div className={`p-3 ${isDarkMode ? 'border-gray-700 border' : 'border'} rounded-md flex justify-between items-center relative ${isDarkMode ? 'bg-gray-700' : ''}`}>
            <div>
              <FontAwesomeIcon icon={faHeart} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
              <span>Gender: <strong>{profile.gender}</strong></span>
            </div>
            {isOwner && (
              <button onClick={() => toggleDropdown("gender")} className={`${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-800'}`}>•••</button>
            )}
            {dropdownOpen === "gender" && (
              <div className={`absolute right-3 top-10 ${isDarkMode ? 'bg-gray-800 border' : 'bg-white'} shadow-md rounded-md p-2`}>
                <button onClick={handleEditClick} className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}>✏️ Edit</button>
              </div>
            )}
          </div>
        ) : (
          isOwner && (
            <button className={`w-full ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border text-gray-500 hover:bg-gray-100'} p-3 rounded-md flex items-center justify-center`} onClick={handleEditClick}>
              ➕ Add your gender
            </button>
          )
        )}

        {profile.jobProfile ? (
          <div className={`p-3 ${isDarkMode ? 'border-gray-700 border' : 'border'} rounded-md flex justify-between items-center relative ${isDarkMode ? 'bg-gray-700' : ''}`}>
            <div>
              <FontAwesomeIcon icon={faBriefcase} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
              <span>
                {profile.jobProfile}
              </span>
            </div>
            {isOwner && (
              <button className={`${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-800'}`} onClick={() => toggleDropdown("jobProfile")}>•••</button>
            )}
            {dropdownOpen === "jobProfile" && (
              <div className={`absolute right-3 top-10 ${isDarkMode ? 'bg-gray-800 border' : 'bg-white'} shadow-md rounded-md p-2`}>
                <button onClick={handleEditClick} className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}>✏️ Edit</button>
              </div>
            )}
          </div>
        ) : (
          isOwner && (
            <button className={`w-full ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border text-gray-500 hover:bg-gray-100'} p-3 rounded-md flex items-center justify-center`} onClick={handleEditClick}>
              ➕ Add your job Profile
            </button>
          )
        )}

        {profile.location ? (
          <div className={`p-3 ${isDarkMode ? 'border-gray-700 border' : 'border'} rounded-md flex justify-between items-center relative ${isDarkMode ? 'bg-gray-700' : ''}`}>
            <div>
              <FontAwesomeIcon icon={faLocationDot} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
              <span>Lives in: <strong>{profile.location}</strong></span>
            </div>
            {isOwner && (
              <button onClick={() => toggleDropdown("location")} className={`${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-800'}`}>•••</button>
            )}
            {dropdownOpen === "location" && (
              <div className={`absolute right-3 top-10 ${isDarkMode ? 'bg-gray-800 border' : 'bg-white'} shadow-md rounded-md p-2`}>
                <button onClick={handleEditClick} className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}>✏️ Edit</button>
              </div>
            )}
          </div>
        ) : (
          isOwner && (
            <button className={`w-full ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border text-gray-500 hover:bg-gray-100'} p-3 rounded-md flex items-center justify-center`} onClick={handleEditClick}>
              ➕ Add your location
            </button>
          )
        )}

        <div className={`p-3 ${isDarkMode ? 'border-gray-700 border' : 'border'} rounded-md flex justify-between items-center ${isDarkMode ? 'bg-gray-700' : ''}`}>
          <div>
            <FontAwesomeIcon icon={faCalendar} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
            <span>Joined on: <strong>{profile.joinDate || "N/A"}</strong></span>
          </div>
        </div>

        <div className={`p-3 ${isDarkMode ? 'border-gray-700 border' : 'border'} rounded-md flex justify-between items-center ${isDarkMode ? 'bg-gray-700' : ''}`}>
          <div>
            <FontAwesomeIcon icon={faEnvelope} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
            <span>
              Email: <strong>{profile.email}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;