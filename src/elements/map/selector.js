/** @format */
// 2023 год, я в 10-11 классе
import React, { useCallback, useEffect, useState } from "react";
import "./selector.css";

const Selector = ({ tool, instrument, exceptions, focus }) => {
  // This component is only customization
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const [shown, setShown] = useState(false);

  const mousePressing = useCallback(
    (e) => {
      if (
        tool === "selection" &&
        focus === "map" &&
        instrument !== "brushAdd" &&
        instrument !== "brushRemove"
      ) {
        setOrigin({ x: e.x, y: e.y });
        exceptions && setShown(true);
      }
    },
    [setShown, setOrigin, tool, exceptions, focus, instrument]
  );

  const mouseReleasing = useCallback(
    (e) => {
      if (tool === "selection") {
        setTarget({ x: e.x, y: e.y });
        setShown(false);
      }
    },
    [setTarget, setShown, tool]
  );
  const mouseMovement = useCallback(
    (e) => {
      if (tool === "selection" && exceptions) {
        setTarget({ x: e.x, y: e.y });
      }
    },
    [setTarget, tool, exceptions]
  );

  useEffect(() => {
    window.addEventListener("mousedown", mousePressing);
    window.addEventListener("mouseup", mouseReleasing);
    window.addEventListener("mousemove", mouseMovement);
    return () => {
      window.removeEventListener("mousedown", mousePressing);
      window.removeEventListener("mouseup", mouseReleasing);
      window.removeEventListener("mousemove", mouseMovement);
    };
  }, [mouseMovement, mousePressing, mouseReleasing]);

  return (
    shown &&
    tool === "selection" && (
      <div
        className="selector"
        style={{
          top: origin.y < target.y ? origin.y : target.y,
          left: origin.x < target.x ? origin.x : target.x,
          width:
            origin.x < target.x ? target.x - origin.x : origin.x - target.x,
          height:
            origin.y < target.y ? target.y - origin.y : origin.y - target.y,
        }}></div>
    )
  );
};

export default Selector;
