/** @format */
// 2023 год, я в 10-11 классе
import React, { useCallback, useState, memo, useRef, useEffect } from "react";
import Button from "../buttons/button";
import ButtonList from "../buttons/buttonList";
import "./controlls.css";

const buttonsTools = [
  { src: "./icons/cursor.png", alt: "mouse" },
  { src: "./icons/select.png", alt: "selection" },
  { src: "./icons/building.png", alt: "buildings" },
  { src: "./icons/brush.png", alt: "brush" },
  { src: "./icons/zoomin.png", alt: "zooming" },
  { src: "./icons/hand.png", alt: "hand" },
  { src: "./icons/info.png", alt: "info" },
  { src: "./icons/info.png", alt: "states" },
  { src: "./icons/info.png", alt: "imperators" },
];

const lists = {
  buildings: [
    { src: "./icons/star.png", alt: "star", description: "Capital" },
    {
      src: "./icons/mountains.png",
      alt: "mountains",
      description: "Mountains",
    },
    { src: "./icons/farm.png", alt: "farm", description: "Farm" },
    { src: "./icons/science.png", alt: "science", description: "Laboratory" },
    { src: "./icons/factory.png", alt: "factory", description: "Factory" },
    { src: "./icons/castle.png", alt: "castle", description: "Defence" },
    { src: "./icons/barracks.png", alt: "barracks", description: "Barracks" },
    { src: "./icons/church.png", alt: "church", description: "Church" },
    { src: "./icons/gold.png", alt: "gold", description: "Gold" },
    { src: "", alt: "n", description: "Nothing" },
  ],
  selection: [
    {
      src: "./icons/select.png",
      alt: "select",
      description: "Simple selection",
    },
    {
      src: "./icons/selectionadd.png",
      alt: "add",
      description: "Square seleciton",
    },
    {
      src: "./icons/selectionremove.png",
      alt: "remove",
      description: "Hold Alt with square selection tool",
    },
    {
      src: "./icons/brushaddselection.png",
      alt: "brushAdd",
      description: "Brush selection",
    },
    {
      src: "./icons/brushremoveselection.png",
      alt: "brushRemove",
      description: "Hold Alt with brush selection tool",
    },
  ],
  brush: [
    { src: "", alt: "plain", description: "Plain" },
    { src: "", alt: "forest", description: "Forest" },
    { src: "", alt: "mountains", description: "Mountains" },
    { src: "", alt: "river", description: "River" },
    { src: "", alt: "sands", description: "Sands" },
    { src: "", alt: "disaster", description: "Disaster" },
  ],
  zooming: [
    { src: "./icons/zoomin.png", alt: "zoomin", description: "Press Z" },
    {
      src: "./icons/zoomout.png",
      alt: "zoomout",
      description: "Hold alt with zoom tool",
    },
  ],
  hand: [],
  info: [],
  mouse: [],
  states: [],
  imperators: [],
};

const Controlls = memo(
  ({
    tool,
    instrument,
    changeInstrument,
    changeTool,
    focus,
    setInfoShown,
    setControlFocus,
  }) => {
    // console.log("Controls");

    const [isListShown, setIsListShown] = useState(false);
    let buttonListCoordinates = useRef({ x: 0, y: 0 });

    const instrumentChange = useCallback(
      (newInstrument) => {
        changeInstrument(newInstrument);
        setIsListShown(false);
        // console.log(newInstrument);
      },
      [changeInstrument, setIsListShown]
    );
    const buttonClick = useCallback(
      (newInstrType) => {
        changeTool(newInstrType);
        if (newInstrType !== tool) {
          lists[newInstrType][0] &&
            instrumentChange(lists[newInstrType][0].alt);
          if (newInstrType === "info") {
            setInfoShown(true);
          }
        }
      },
      [changeTool, instrumentChange, tool, setInfoShown]
    );

    useEffect(() => {
      if (focus !== "buttonlist") {
        setIsListShown(false);
        // console.log;
      }
    }, [focus, setIsListShown]);

    const buttonHold = useCallback(
      (toolPressed, coordinates) => {
        buttonClick(toolPressed);
        setIsListShown(true);
        setControlFocus("buttonlist");
        buttonListCoordinates.current = coordinates;
      },
      [buttonClick, setIsListShown, setControlFocus]
    );

    return (
      <div className="stuff">
        {buttonsTools.map((elem, ind) => {
          return (
            <Button
              pressed={tool === elem.alt}
              src={elem.src}
              type="controls"
              key={ind}
              alt={elem.alt}
              buttonHold={buttonHold}
              buttonClick={buttonClick}></Button>
          );
        })}
        <ButtonList
          shown={isListShown}
          top={buttonListCoordinates.current.y}
          left={buttonListCoordinates.current.x}
          pressedButton={instrument}
          list={lists[tool]}
          buttonClick={instrumentChange}></ButtonList>
      </div>
    );
  }
);

export default Controlls;
