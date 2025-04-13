/** @format */

import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import Nav from "./nav";
import "./window.css";

const borderSensetivity = 7;

const WindowWrapper = memo(
  ({
    children,
    name = "untitled",
    shown = true,
    closeWindow,
    specifications,
    visibilityOrder,
    setVisibilityOrder,
    setFocus,
    component: Component,
    ...other
  }) => {
    // console.log("Window", name);
    //Variables
    const mouseHolding = useRef(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [size, setSize] = useState({
      width: specifications.size.width,
      height: specifications.size.height,
    });
    const [magnifity, setMagnifity] = useState("");
    const magnifityRef = useRef("");
    const sizeRef = useRef(size);
    const positionRef = useRef(position);
    let resize = useRef({
      top: false,
      bottom: false,
      left: false,
      right: false,
    });
    // console.log(position, size, magnifity);

    // Functions
    const checkWindow = (newPosition, movementX = 1, movementY = 1) => {
      movementX = Math.abs(movementX);
      movementY = Math.abs(movementY);
      if (newPosition.top + sizeRef.current.height >= window.innerHeight) {
        if (sizeRef.current.height >= window.innerHeight * 0.9) {
          sizeRef.current = {
            ...sizeRef.current,
            height: sizeRef.current.height - movementY,
          };
        }
        newPosition.top = window.innerHeight - sizeRef.current.height;
      } else if (newPosition.top < 0) {
        if (sizeRef.current.height >= window.innerHeight * 0.9) {
          sizeRef.current = {
            ...sizeRef.current,
            height: sizeRef.current.height - movementY,
          };
        }
        newPosition.top = 0;
      }
      if (newPosition.left + sizeRef.current.width >= window.innerWidth) {
        if (sizeRef.current.width >= window.innerWidth * 0.9) {
          sizeRef.current = {
            ...sizeRef.current,
            width: sizeRef.current.width - movementX,
          };
        }
        newPosition.left = window.innerWidth - sizeRef.current.width;
      } else if (newPosition.left < 0) {
        if (sizeRef.current.width >= window.innerWidth * 0.9) {
          sizeRef.current = {
            ...sizeRef.current,
            width: sizeRef.current.width - movementX,
          };
        }
        newPosition.left = 0;
      }
      return newPosition;
    };
    const checkMagnification = useCallback(() => {
      let magnifityVar = magnifityRef.current;
      if (positionRef.current.top < borderSensetivity) {
        if (!magnifityVar.includes("top")) magnifityVar += " top ";
      } else {
        let buffer = magnifityVar.split(" ");
        buffer[magnifityVar.split(" ").findIndex((el) => el === "top")] = "";
        magnifityVar = buffer.join(" ");
        magnifityVar = magnifityVar.trim();
      }
      if (positionRef.current.left < borderSensetivity) {
        if (!magnifityVar.includes("left")) magnifityVar += " left ";
      } else {
        let buffer = magnifityVar.split(" ");
        buffer[magnifityVar.split(" ").findIndex((el) => el === "left")] = "";
        magnifityVar = buffer.join(" ");
        magnifityVar = magnifityVar.trim();
      }
      if (
        positionRef.current.top + sizeRef.current.height >
        window.innerHeight - borderSensetivity
      ) {
        if (!magnifityVar.includes("bottom")) magnifityVar += " bottom ";
      } else {
        let buffer = magnifityVar.split(" ");
        buffer[magnifityVar.split(" ").findIndex((el) => el === "bottom")] = "";
        magnifityVar = buffer.join(" ");
        magnifityVar = magnifityVar.trim();
      }
      if (
        positionRef.current.left + sizeRef.current.width >
        window.innerWidth - borderSensetivity
      ) {
        if (!magnifityVar.includes("right")) magnifityVar += " right ";
      } else {
        let buffer = magnifityVar.split(" ");
        buffer[magnifityVar.split(" ").findIndex((el) => el === "right")] = "";
        magnifityVar = buffer.join(" ");
        magnifityVar = magnifityVar.trim();
      }

      // if (magnifityVar.includes("top") && magnifityVar.includes("bottom")) {
      //   sizeRef.current.height = window.innerHeight;
      // }
      // if (magnifityVar.includes("left") && magnifityVar.includes("right")) {
      //   sizeRef.current.width = window.innerWidth;
      // }
      setMagnifity(magnifityVar);
      magnifityRef.current = magnifityVar;
    }, []);
    // Event handlers
    const mouseDown = useCallback((e) => {
      mouseHolding.current = true;
    }, []);
    const mouseReleased = useCallback((e) => {
      mouseHolding.current = false;
      resize.current = {
        top: false,
        bottom: false,
        left: false,
        right: false,
      };
    }, []);
    const mouseMoved = useCallback(
      (e) => {
        if (mouseHolding.current) {
          positionRef.current.top += e.movementY;
          positionRef.current.left += e.movementX;
          positionRef.current = checkWindow(
            positionRef.current,
            e.movementX,
            e.movementY
          );
        }
        if (
          resize.current.top ||
          resize.current.bottom ||
          resize.current.left ||
          resize.current.right
        ) {
          if (resize.current.top) {
            if (
              sizeRef.current.height <= specifications.minSize.height &&
              e.movementY > 0
            ) {
            } else {
              positionRef.current = {
                ...positionRef.current,
                top: positionRef.current.top + e.movementY,
              };
              sizeRef.current = {
                ...sizeRef.current,
                height: sizeRef.current.height - e.movementY,
              };
            }
          }
          if (resize.current.left) {
            if (
              sizeRef.current.width <= specifications.minSize.width &&
              e.movementX > 0
            ) {
            } else {
              positionRef.current = {
                ...positionRef.current,
                left: positionRef.current.left + e.movementX,
              };
              sizeRef.current = {
                ...sizeRef.current,
                width: sizeRef.current.width - e.movementX,
              };
            }
          }
          if (resize.current.bottom) {
            if (
              sizeRef.current.height <= specifications.minSize.height &&
              e.movementY < 0
            ) {
            } else {
              sizeRef.current = {
                ...sizeRef.current,
                height: sizeRef.current.height + e.movementY,
              };
            }
          }
          if (resize.current.right) {
            if (
              sizeRef.current.width <= specifications.minSize.width &&
              e.movementX < 0
            ) {
            } else {
              sizeRef.current = {
                ...sizeRef.current,
                width: sizeRef.current.width + e.movementX,
              };
            }
          }
          positionRef.current = checkWindow(positionRef.current, 0, 0);
        }
        if (
          resize.current.top ||
          resize.current.bottom ||
          resize.current.left ||
          resize.current.right ||
          mouseHolding.current
        ) {
          setSize({ ...sizeRef.current });
          setPosition({ ...positionRef.current });
          checkMagnification();
        }
      },
      [setSize, setPosition, specifications, checkMagnification]
    );
    const changeSize = useCallback((e) => {
      const className = e.target.classList[1];
      if (className.includes("top")) resize.current.top = true;
      if (className.includes("bottom")) resize.current.bottom = true;
      if (className.includes("left")) resize.current.left = true;
      if (className.includes("right")) resize.current.right = true;
    }, []);

    const changeVisibilityOrder = useCallback(() => {
      let visibilityVar = visibilityOrder;
      setFocus(name);
      visibilityVar.splice(
        visibilityVar.findIndex((el) => el === name),
        1
      );
      visibilityVar.push(name);
      setVisibilityOrder([...visibilityVar]);
    }, [name, visibilityOrder, setVisibilityOrder, setFocus]);

    // Global events
    useEffect(() => {
      window.addEventListener("mousemove", mouseMoved);
      window.addEventListener("mouseup", mouseReleased);
      return () => {
        window.removeEventListener("mousemove", mouseMoved);
        window.removeEventListener("mouseup", mouseReleased);
      };
    }, [mouseMoved, mouseReleased]);
    // Calculating specifications (bottom to top and right to left, joining size with width and height)
    useEffect(() => {
      let [top, left] = [
        specifications.position.top,
        specifications.position.left,
      ];
      if (specifications.position.bottom !== null) {
        top =
          window.innerHeight -
          specifications.position.bottom -
          specifications.size.height;
      }
      if (specifications.position.right !== null) {
        left =
          window.innerWidth -
          specifications.position.right -
          specifications.size.width;
      }
      positionRef.current = { top, left };
      sizeRef.current = { ...specifications.size };
      setPosition(positionRef.current);
      setSize(sizeRef.current);
      checkMagnification();
    }, [setPosition, setSize, specifications, checkMagnification]);

    return (
      shown && (
        <div
          className="window"
          style={{
            zIndex: (visibilityOrder.findIndex((el) => el === name) + 1) * 2,
            top: magnifity.includes("top")
              ? 0
              : magnifity.includes("bottom")
              ? window.innerHeight - size.height
              : position.top,
            left: magnifity.includes("left")
              ? 0
              : magnifity.includes("right")
              ? window.innerWidth - size.width
              : position.left,
            width:
              magnifity.includes("left") && magnifity.includes("right")
                ? window.innerWidth
                : size.width,
            height:
              magnifity.includes("top") && magnifity.includes("bottom")
                ? window.innerHeight
                : size.height,
            borderTopLeftRadius:
              magnifity.includes("top") || magnifity.includes("left") ? 0 : 3,
            borderTopRightRadius:
              magnifity.includes("top") || magnifity.includes("right") ? 0 : 3,
            borderBottomRightRadius:
              magnifity.includes("bottom") || magnifity.includes("right")
                ? 0
                : 3,
            borderBottomLeftRadius:
              magnifity.includes("bottom") || magnifity.includes("left")
                ? 0
                : 3,
          }}
          onMouseDown={changeVisibilityOrder}>
          <div
            className="windowborder bordertop"
            style={{ width: size.width - 6 }}
            onMouseDown={changeSize}></div>
          <div
            className="windowborder borderbottom"
            style={{ width: size.width - 6 }}
            onMouseDown={changeSize}></div>
          <div
            className="windowborder borderleft"
            style={{ height: size.height - 6 }}
            onMouseDown={changeSize}></div>
          <div
            className="windowborder borderright"
            style={{ height: size.height - 6 }}
            onMouseDown={changeSize}></div>
          <div
            className="windowangle angletopleft"
            onMouseDown={changeSize}></div>
          <div
            className="windowangle angletopright"
            onMouseDown={changeSize}></div>
          <div
            className="windowangle anglebottomright"
            onMouseDown={changeSize}></div>
          <div
            className="windowangle anglebottomleft"
            onMouseDown={changeSize}></div>

          <Nav
            closeWindow={closeWindow}
            name={name}
            mouseDown={mouseDown}></Nav>
          <div
            className="windowchildren"
            border={
              position.top + size.height >
              window.innerHeight - borderSensetivity
                ? ""
                : position.left < borderSensetivity
                ? position.left + size.width >
                  window.innerWidth - borderSensetivity
                  ? ""
                  : "right"
                : position.left + size.width >
                  window.innerWidth - borderSensetivity
                ? "left"
                : "left right"
            }>
            {children}
            {Component && <Component {...other}></Component>}
          </div>
        </div>
      )
    );
  }
);

export default WindowWrapper; // to children set position absolute and width and height to a hundred percent;
