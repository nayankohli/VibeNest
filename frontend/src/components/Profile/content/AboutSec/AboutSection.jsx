import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faBriefcase, faLocationDot, faEnvelope, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
const AboutSection = ({ profile, loggedInUserId }) => {
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
    <div className="bg-white p-4 rounded-lg shadow-md border">
      <h2 className="text-lg font-semibold mb-4">Profile Info</h2>

      <div className="p-3 bg-gray-100 rounded-md relative">
        <h3 className="text-md font-semibold mb-2">Overview</h3>
        <p className="text-gray-600">
          {profile.bio || (isOwner ? "Add a bio to let others know about you." : "")}
        </p>
        {isOwner && (
          <button onClick={() => toggleDropdown("bio")} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">•••</button>
        )}
        {dropdownOpen === "bio" && (
          <div className="absolute right-3 top-10 bg-white shadow-md rounded-md p-2">
            <button onClick={handleEditClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">✏️ Edit</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {profile.dob ? (
          <div className="p-3 border rounded-md flex justify-between items-center relative">
            <div>
              <FontAwesomeIcon icon={faCalendar} className="text-gray-500 mr-2" />
              <span>Born: <strong>{format(new Date(profile.dob), "dd MMMM yyyy")}</strong></span>
            </div>
            {isOwner && (
              <button onClick={() => toggleDropdown("dob")} className="text-gray-500 hover:text-gray-700">•••</button>
            )}
            {dropdownOpen === "dob" && (
              <div className="absolute right-3 top-10 bg-white shadow-md rounded-md p-2">
                <button onClick={handleEditClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">✏️ Edit</button>
              </div>
            )}
          </div>
        ) : (
          isOwner && (
            <button className="w-full border p-3 text-gray-500 rounded-md hover:bg-gray-100 flex items-center justify-center" onClick={handleEditClick}>
              ➕ Add your birth date
            </button>
          )
        )}

        {profile.gender ? (
          <div className="p-3 border rounded-md flex justify-between items-center relative">
            <div>
              <FontAwesomeIcon icon={faHeart} className="text-gray-500 mr-2" />
              <span>Gender: <strong>{profile.gender}</strong></span>
            </div>
            {isOwner && (
              <button onClick={() => toggleDropdown("gender")} className="text-gray-500 hover:text-gray-700">•••</button>
            )}
            {dropdownOpen === "gender" && (
              <div className="absolute right-3 top-10 bg-white shadow-md rounded-md p-2">
                <button onClick={handleEditClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">✏️ Edit</button>
              </div>
            )}
          </div>
        ) : (
          isOwner && (
            <button className="w-full border p-3 text-gray-500 rounded-md hover:bg-gray-100 flex items-center justify-center" onClick={handleEditClick}>
              ➕ Add your gender
            </button>
          )
        )}

        {profile.jobProfile ? (
          <div className="p-3 border rounded-md flex justify-between items-center">
            <div>
              <FontAwesomeIcon icon={faBriefcase} className="text-gray-500 mr-2" />
              <span>
                {profile.jobProfile }
              </span>
            </div>
            {isOwner && (<button className="text-gray-500 hover:text-gray-700"onClick={() => toggleDropdown("jobProfile")} >•••</button>
          )}
          {dropdownOpen === "jobProfile" && (
              <div className="absolute right-3 top-10 bg-white shadow-md rounded-md p-2">
                <button onClick={handleEditClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">✏️ Edit</button>
              </div>
            )}
          </div>
        ):(
          // Show only "➕ Add your birth date" for the owner without icon and field name
          isOwner && (
            <button className="w-full border p-3 text-gray-500 rounded-md hover:bg-gray-100 flex items-center justify-center"onClick={handleEditClick}>
              ➕ Add your job Profile
            </button>
          )
        )}

        {profile.location ? (
          <div className="p-3 border rounded-md flex justify-between items-center relative">
            <div>
              <FontAwesomeIcon icon={faLocationDot} className="text-gray-500 mr-2" />
              <span>Lives in: <strong>{profile.location}</strong></span>
            </div>
            {isOwner && (
              <button onClick={() => toggleDropdown("location")} className="text-gray-500 hover:text-gray-700">•••</button>
            )}
            {dropdownOpen === "location" && (
              <div className="absolute right-3 top-10 bg-white shadow-md rounded-md p-2">
                <button onClick={handleEditClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">✏️ Edit</button>
              </div>
            )}
          </div>
        ) : (
          isOwner && (
            <button className="w-full border p-3 text-gray-500 rounded-md hover:bg-gray-100 flex items-center justify-center" onClick={handleEditClick}>
              ➕ Add your location
            </button>
          )
        )}

<div className="p-3 border rounded-md flex justify-between items-center">
          <div>
            <FontAwesomeIcon icon={faCalendar} className="text-gray-500 mr-2" />
            <span>Joined on: <strong>{profile.joinDate || "N/A"}</strong></span>
          </div>
        </div>

          <div className="p-3 border rounded-md flex justify-between items-center">
            <div>
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-2" />
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
