/** @format */

import React from "react";
import Button from "./../buttons/button";
import "./close.css";

const Close = ({ closeWindow }) => {
  return (
    <div className="closebutton">
      <Button
        src="icons/cross.png"
        alt="cross"
        type="window"
        buttonClick={closeWindow}></Button>
    </div>
  );
};

export default Close;
