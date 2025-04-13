/** @format */

import React, { useEffect, useState } from "react";
import Button from "./buttons/button";
import Nav from "./window/nav";
import "./alert.css";

const Alert = ({
  name = "Untitled",
  shown = false,
  confirmAvailable = true,
  children,
  confirm,
}) => {
  const [showing, setShowing] = useState(shown);

  const confirming = (e) => {
    confirm && confirm(e);
  };

  useEffect(() => {
    setShowing(shown);
  }, [shown, setShowing]);

  return (
    showing && (
      <div className="alert">
        <div className="alertwindow">
          <Nav
            name={name}
            closeWindow={() => {
              setShowing(false);
            }}></Nav>
          <div className="alertcontent">{children}</div>
          <div className="alertcontrols">
            <div></div>
            {confirmAvailable ? (
              <Button pressed={false} src="" buttonClick={confirming}>
                Confirm
              </Button>
            ) : (
              "Make some changes to conrifm"
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Alert;
