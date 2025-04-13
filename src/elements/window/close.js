/** @format */
// 2023 год, я в 10-11 классе
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
