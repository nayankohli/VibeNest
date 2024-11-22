import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage,faVideo, faFaceSmile} from "@fortawesome/free-solid-svg-icons";

const Stories=()=>{

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return(
    <div className="Stories-Panel">
        <div className="myStory"></div>
        <div className="Stories"></div>
    </div>
  );
};

export default Stories;