/** @format */
// 2023 год, я в 10-11 классе
import React, { useCallback, useEffect } from "react";

// const

const Info = ({ tool, setInfoPosition }) => {
  // const [videoUrl, setVideoUrl] = useState("");
  // const [text, setText] = useState("Nothing there");

  const handleMouseRelease = useCallback(
    (e) => {
      // console.log(tool);
      if (tool === "info" && e.ctrlKey) {
        console.log(e);
        setInfoPosition({ top: e.y, left: e.x });
      }
    },
    [setInfoPosition, tool]
  );

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseRelease);
    return () => {
      window.removeEventListener("mouseup", handleMouseRelease);
    };
  }, [handleMouseRelease]);
  return (
    <div className="info">
      <div className="infovideo">
        <video src={""} autoPlay loop></video>
      </div>
      <div className="infotext">{""}</div>
    </div>
  );
};

export default Info;
