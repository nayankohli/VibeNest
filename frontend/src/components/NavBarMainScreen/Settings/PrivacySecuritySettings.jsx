import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faLock,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  updatePrivacy,
  resetPrivacyUpdate,
  changePassword,
} from "../../../actions/UserActions";
import { toast } from "sonner";
function PrivacySecuritySettings({ handleBackToMenu }) {
  const dispatch = useDispatch();
  const { isDarkMode } = useContext(ThemeContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userPrivacyUpdate = useSelector((state) => state.userPrivacyUpdate);
  const userPasswordUpdate = useSelector((state) => state.userPasswordUpdate);
  const {
    loading: privacyLoading,
    success: privacySuccess,
    error: privacyError,
  } = userPrivacyUpdate;
  const {
    loading: passwordLoading,
    success: passwordSuccess,
    error: passwordError,
  } = userPasswordUpdate || {};

  const isPrivateAccount = userInfo?.privacy === "private";

  // Handle privacy status change
  const handlePrivacyChange = () => {
    // Toggle between "public" and "private"
    const newPrivacyStatus = isPrivateAccount ? "public" : "private";
    dispatch(updatePrivacy(newPrivacyStatus));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic password validation
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        style: {
          background: "linear-gradient(135deg, #ef4444, #b91c1c)",
          color: "white",
          fontWeight: "bold",
          padding: "14px 20px",
          borderRadius: "12px",
        },
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match", {
        style: {
          background: "linear-gradient(135deg, #ef4444, #b91c1c)",
          color: "white",
          fontWeight: "bold",
          padding: "14px 20px",
          borderRadius: "12px",
        },
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    // Dispatch password change action
    dispatch(
      changePassword({
        currentPassword,
        newPassword,
      })
    );
  };

  useEffect(() => {
    if (privacySuccess) {
      toast.success(
        `Account is now ${
          userInfo.privacy === "private" ? "private" : "public"
        }`,
        {
          style: {
            background: isDarkMode ? "" : "black",
            color: isDarkMode ? "black" : "white",
            fontWeight: "bold",
            padding: "14px 20px",
            boxShadow: "0px 6px 15px rgba(22, 163, 74, 0.3)",
            borderRadius: "12px",
            border: "2px solid #38bdf8",
            textAlign: "center",
            letterSpacing: "0.5px",
            transition: "transform 0.3s ease-in-out",
          },
          position: "top-center",
          duration: 3000,
        }
      );
      dispatch(resetPrivacyUpdate());
    }

    if (privacyError) {
      toast.error(`Failed to update privacy: ${privacyError}`, {
        style: {
          background: "linear-gradient(135deg, #ef4444, #b91c1c)",
          color: "white",
          fontWeight: "bold",
          padding: "14px 20px",
          boxShadow: "0px 6px 15px rgba(239, 68, 68, 0.3)",
          borderRadius: "12px",
          border: "2px solid #38bdf8",
          textAlign: "center",
          letterSpacing: "0.5px",
          transition: "transform 0.3s ease-in-out",
        },
        position: "top-center",
        duration: 3000,
      });
      dispatch(resetPrivacyUpdate());
    }
  }, [privacySuccess, privacyError, userInfo, dispatch]);

  useEffect(() => {
    if (passwordSuccess) {
      toast.success("Password successfully updated", {
        style: {
          background: isDarkMode ? "" : "black",
          color: isDarkMode ? "black" : "white",
          fontWeight: "bold",
          padding: "14px 20px",
          boxShadow: "0px 6px 15px rgba(22, 163, 74, 0.3)",
          borderRadius: "12px",
          border: "2px solid #38bdf8",
          textAlign: "center",
        },
        position: "top-center",
        duration: 3000,
      });

      // Reset password fields after successful update
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    if (passwordError) {
      toast.error(`Failed to update password: ${passwordError}`, {
        style: {
          background: "linear-gradient(135deg, #ef4444, #b91c1c)",
          color: "white",
          fontWeight: "bold",
          padding: "14px 20px",
          borderRadius: "12px",
        },
        position: "top-center",
        duration: 3000,
      });
    }
  }, [passwordSuccess, passwordError, isDarkMode]);

  return (
    <div
      className={`p-6 rounded-lg ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2
        className={`text-2xl flex font-bold mb-1 ${
          isDarkMode ? "text-green-400" : "text-green-600"
        }`}
      >
        <div
          className={`cursor-pointer block lg:hidden p-1 -ml-4 mr-4 rounded-full ${
            isDarkMode ? "hover:bg-gray-700 text-white" : "hover:bg-green-100"
          }`}
          onClick={() => handleBackToMenu()}
        >
          <FontAwesomeIcon icon={faArrowLeft}  />
        </div>
        <i className="fas fa-lock mr-3 "></i>Privacy & Security
      </h2>
      <p
        className={`text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        } mb-6`}
      >
        Manage your account security and privacy preferences.
      </p>

      {/* Account Privacy Toggle */}
      <div
        className={`flex justify-between items-center py-3 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div>
          <span className="font-medium">Account Privacy</span>
          <p
            className={`text-xs mt-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            When your account is private, only approved followers can see your
            content
          </p>
        </div>

        <label
          className={`relative inline-flex items-center ${
            privacyLoading ? "opacity-50 cursor-wait" : "cursor-pointer"
          }`}
        >
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isPrivateAccount}
            onChange={handlePrivacyChange}
            disabled={privacyLoading}
          />
          <div
            className={`
            w-12 h-6 rounded-full 
            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
            after:bg-white after:rounded-full after:h-5 after:w-5 
            after:transition-all after:duration-300
            ${
              isPrivateAccount
                ? "after:translate-x-6 bg-green-500"
                : `${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`
            }
            ${isDarkMode ? "border border-gray-600" : ""}
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300
          `}
          ></div>
          {privacyLoading && (
            <span className="ml-2 animate-pulse">Updating...</span>
          )}
        </label>
      </div>

      {/* Two-Factor Authentication */}
      <div
        className={`flex justify-between items-center py-3 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div>
          <span className="font-medium">Two-Factor Authentication</span>
          <p
            className={`text-xs mt-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Add an extra layer of security to your account
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={twoFactorAuth}
            onChange={() => setTwoFactorAuth(!twoFactorAuth)}
          />
          <div
            className={`
            w-12 h-6 rounded-full 
            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
            after:bg-white after:rounded-full after:h-5 after:w-5 
            after:transition-all after:duration-300
            ${
              twoFactorAuth
                ? "after:translate-x-6 bg-green-500"
                : `${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`
            }
            ${isDarkMode ? "border border-gray-600" : ""}
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300
          `}
          ></div>
        </label>
      </div>

      {/* Login Alerts */}
      <div
        className={`flex justify-between items-center py-3 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div>
          <span className="font-medium">Login Alerts</span>
          <p
            className={`text-xs mt-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Get notified when someone logs into your account from a new device
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={loginAlerts}
            onChange={() => setLoginAlerts(!loginAlerts)}
          />
          <div
            className={`
            w-12 h-6 rounded-full 
            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
            after:bg-white after:rounded-full after:h-5 after:w-5 
            after:transition-all after:duration-300
            ${
              loginAlerts
                ? "after:translate-x-6 bg-green-500"
                : `${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`
            }
            ${isDarkMode ? "border border-gray-600" : ""}
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300
          `}
          ></div>
        </label>
      </div>

      {/* Password Change Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Change your password</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Current password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-2 rounded border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                New password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className={`w-full px-4 py-2 rounded border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <FontAwesomeIcon
                    icon={showNewPassword ? faEyeSlash : faEye}
                    className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                  />
                </button>
              </div>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Write your password...
              </p>
            </div>

            <div>
              <label
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Confirm password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-2 rounded border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className={`px-4 py-2 rounded font-medium 
                ${
                  passwordLoading
                    ? "bg-green-300 cursor-wait"
                    : "bg-green-500 hover:bg-green-600"
                } 
                text-white transition-colors duration-200`}
            >
              {passwordLoading ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </div>

      {/* Additional Security Options */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Additional Security</h3>

        <div
          className={`flex justify-between items-center py-3 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faLock} className="mr-3 text-green-400" />
            <span>Active Sessions</span>
          </div>
          <button className="text-green-500 hover:text-green-600">
            Manage
          </button>
        </div>

        <div
          className={`flex justify-between items-center py-3 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faLock} className="mr-3 text-green-400" />
            <span>Connected Apps</span>
          </div>
          <button className="text-green-500 hover:text-green-600">View</button>
        </div>
      </div>
    </div>
  );
}

export default PrivacySecuritySettings;
