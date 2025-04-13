/** @format */
// 2023 год, я в 10-11 классе
import React from "react";
import "./menu.css";
import Button from "./buttons/button";

const windowMenu = [
  { name: "All windows " },
  { name: "Map and properties " },
  { name: "Custom" },
];

const Menu = () => {
  return (
    <>
      <div className="nav">
        <Button src="./icons/menu.png" alt="menu" type="controls"></Button>
        <div className="windowmenu">
          {windowMenu.map((elem, index) => {
            return (
              <Button key={index} type="menu">
                {elem.name}
              </Button>
            );
          })}
        </div>
        <Button
          src="./icons/settings.png"
          alt="settings"
          type="controls"></Button>
      </div>
    </>
  );
};

export default Menu;
