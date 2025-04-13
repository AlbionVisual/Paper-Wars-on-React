/** @format */
// 2023 год, я в 10-11 классе
import React, { useCallback, useEffect, useRef } from "react";
import Button from "./button";
import "./buttonList.css";

const ButtonList = ({ shown, list, buttonClick, pressedButton, top, left }) => {
  // console.log("Button list");
  const coordinates = useRef({ x: 0, y: 0 });
  const shownRef = useRef(shown);
  useEffect(() => {
    shownRef.current = shown;
  }, [shown]);

  const onButtonClick = useCallback(
    (e) => {
      // console.log("button list button selected");
      buttonClick && buttonClick(e);
      // removeList();
    },
    [buttonClick]
  );

  const checkCoordinates = () => {
    coordinates.current = { x: left, y: top };
    if (shown && list) {
      if (top + list.length * 30 > window.innerHeight) {
        coordinates.current.y = top - list.length * 30;
      }
      if (left + 200 > window.innerWidth) {
        coordinates.current.x = left - 200;
      }
    }
  };
  checkCoordinates();

  return (
    shown && (
      <div
        className="buttonList"
        style={{ top: coordinates.current.y, left: coordinates.current.x }}>
        {list &&
          list.map((elem, ind) => {
            return (
              <Button
                pressed={pressedButton === elem.alt}
                src={elem.src}
                alt={elem.alt}
                type="controls"
                key={ind}
                buttonClick={onButtonClick}>
                <div>{elem.description}</div>
              </Button>
            );
          })}
      </div>
    )
  );
};
export default ButtonList;
