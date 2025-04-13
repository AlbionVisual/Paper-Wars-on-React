/** @format */
// 2023 год, я в 10-11 классе
import React, { useRef, memo } from "react";
import "./button.css";

const Button = memo(
  ({ src, alt, buttonClick, children, pressed, buttonHold, type, style }) => {
    // console.log("Button");
    let origin = useRef("");
    let target = useRef("");
    let timerId = useRef();

    const onPress = (e) => {
      // console.log("timer start");
      target.current = "";
      origin.current = e.target.alt;
      timerId.current = setTimeout(() => {
        buttonHold && buttonHold(alt, { x: e.clientX, y: e.clientY });
        // console.log("hold");
        timerId.current = "";
      }, 500);
    };

    const onRelease = (e) => {
      target.current = e.target.alt;
      // console.log("release");
      if (timerId.current !== "") {
        // console.log("press");
        clearTimeout(timerId.current);
        timerId.current = "";
        if (target.current === origin.current) {
          buttonClick(alt, e);
        }
      }
    };

    return (
      <div
        className={`button${type} ${pressed ? "pressedButton" + type : ""}`}
        style={style}
        onMouseDown={onPress}
        onMouseUp={onRelease}>
        <img src={src} alt={alt} style={{ display: src ? "block" : "none" }} />
        {children}
      </div>
    );
  }
);

export default Button;

//type can be equal to

// controls
// window
