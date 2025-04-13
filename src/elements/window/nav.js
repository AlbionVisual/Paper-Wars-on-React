/** @format */

import React from "react";
import Close from "./close";
import "./nav.css";

const Nav = ({ name, mouseDown, closeWindow }) => {
  const mouseDownA = () => {
    mouseDown && mouseDown();
  };
  return (
    <div className="windownav" onMouseDown={mouseDownA}>
      <div></div>
      <div className="windowname">{name}</div>
      <Close closeWindow={closeWindow}></Close>
    </div>
  );
};

export default Nav;
