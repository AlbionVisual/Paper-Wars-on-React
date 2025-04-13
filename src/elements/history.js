/** @format */
// 2023 год, я в 10-11 классе
import React, { useEffect, useRef, useState, memo } from "react";
import "./history.css";
import ButtonList from "./buttons/buttonList";

const tagList = [
  { src: "", alt: "State 1", description: "<State 1>" },
  { src: "", alt: "War 1", description: "<War 1>" },
];

const History = memo(({ setFocus }) => {
  // console.log("History");

  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState("");
  const [tag, setTag] = useState("Choose tag");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [tagsShown, setTagsShown] = useState(false);
  const scrollToElem = useRef();
  const historyElem = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const timedLogs = logs.map((elem) => {
      return elem;
    });
    timedLogs.push({ tag: tag, text: input });
    setInput("");
    setLogs(timedLogs);
  };

  useEffect(() => {
    scrollToElem.current.scrollIntoView({ behavior: "auto" });
  }, [logs]);

  const tagChosen = (alt) => {
    setTagsShown(false);
    setTag(alt);
  };

  const chooseTag = (e) => {
    setCoordinates({ x: e.clientX, y: e.clientY });
    setTagsShown(true);
  };
  return (
    <div className="history" ref={historyElem}>
      <div className="texts">
        {logs.map((elem, index) => {
          return (
            <div key={index} className="historyline">
              <div className="tag">
                {"<"}
                {elem.tag}
                {">"}
              </div>
              <div className="text">{elem.text}</div>
            </div>
          );
        })}
        <div ref={scrollToElem}></div>
      </div>
      <form className="historyform" onSubmit={handleSubmit}>
        <button className="historybutton" onClick={chooseTag} type="button">
          {tag}
        </button>
        <ButtonList
          list={tagList}
          top={coordinates.y}
          left={coordinates.x}
          pressedButton=""
          shown={tagsShown}
          setShown={setTagsShown}
          buttonClick={tagChosen}></ButtonList>
        <div className="formcontrol">
          <input
            placeholder="Press here or '/' to start typing..."
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onClick={(e) => {
              e.target.focus();
              setFocus("history");
            }}
            onBlur={() => {
              setFocus("map");
            }}
          />
        </div>

        <button className="historybutton" type="submit">
          Enter
        </button>
      </form>
    </div>
  );
});

export default History;
/*const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;*/
