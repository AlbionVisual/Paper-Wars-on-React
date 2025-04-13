/** @format */

import React, { useCallback, useEffect, useState, useRef } from "react";
import "./properties.css";
import Button from "../buttons/button";
import ButtonList from "../buttons/buttonList";

const buttonsList = {
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
    { src: "./icons/plain.png", alt: "plain", description: "Plain" },
    { src: "./icons/forest.png", alt: "forest", description: "Forest" },
    { src: "./icons/water.png", alt: "river", description: "River" },
    { src: "./icons/sands.png", alt: "sands", description: "Sands" },
    { src: "./icons/disaster.png", alt: "disaster", description: "Disaster" },
    {
      src: "./icons/mountains.png",
      alt: "mountains",
      description: "Mountains",
    },
  ],
  zooming: [
    { src: "./icons/zoomin.png", alt: "zoomin", description: "Press Z" },
    {
      src: "./icons/zoomout.png",
      alt: "zoomout",
      description: "Hold alt with zoom tool",
    },
  ],
};

const Properties = ({
  tool,
  focus,
  setFocus,
  instrument,
  buttonClick,
  deselect,
  removeState,
  setInstrument,
  controlSettings,
  setControlSettings,
  colorSelecting,
  makeAlert,
  states,
  SetStates,
}) => {
  // console.log("Properties");
  const [selectStateListShown, setSelectStateListShown] = useState(false);
  const [selectedState, setSelectedState] = useState("Select state");
  const [listCoordinates, setListCoordinates] = useState({ top: 0, left: 0 });
  const alertInputRef = useRef();

  const onButtonClick = (e) => {
    buttonClick && buttonClick(e);
  };
  const onColorSelecting = (e) => {
    colorSelecting && colorSelecting(e);
  };

  const addColor = useCallback(
    (e) => {
      if (e.target.id === "brushcoloris" && e.target.value !== "") {
        setInstrument(e.target.value);
        const list = controlSettings.brush.listOfLastColors;
        if (list.length >= 10) {
          list.pop();
        }
        setControlSettings({
          ...controlSettings,
          brush: {
            ...controlSettings.brush,
            listOfLastColors: [e.target.value, ...list],
          },
        });
      } else if (e.target.id === "selectioncoloris" && e.target.value !== "") {
        const list = controlSettings.selection.listOfLastColors;
        if (list.length >= 10) {
          list.pop();
        }
        setControlSettings((prev) => {
          return {
            ...prev,
            selection: {
              ...prev.selection,
              listOfLastColors: [e.target.value, ...list],
              selectionColor: [e.target.value],
            },
          };
        });
      }
    },
    [setInstrument, controlSettings, setControlSettings]
  );

  const colorPickerOpen = useCallback(() => {
    setFocus("colorpicker");
  }, [setFocus]);

  const selectState = (alt, e) => {
    setSelectStateListShown(true);
    setListCoordinates({ top: e.pageY, left: e.pageX });
  };
  const changeSelectedState = (alt) => {
    setSelectedState(alt);
    setSelectStateListShown(false);
  };

  useEffect(() => {
    if (focus !== "buttonlist") {
      setSelectStateListShown(false);
    }
  }, [focus, setSelectStateListShown]);

  useEffect(() => {
    document.addEventListener("close", addColor);
    document.addEventListener("open", colorPickerOpen);

    return () => {
      document.removeEventListener("close", addColor);
      document.removeEventListener("open", colorPickerOpen);
    };
  }, [addColor, colorPickerOpen]);

  return (
    <div className="properties">
      <div className="propertiesline">
        {buttonsList[tool] &&
          buttonsList[tool].map((elem, ind) => {
            return (
              <Button
                pressed={instrument === elem.alt}
                src={elem.src}
                type="controls"
                key={ind}
                alt={elem.alt}
                buttonClick={onButtonClick}></Button>
            );
          })}
      </div>
      {buttonsList[tool] && <hr />}
      {tool === "buildings" && (
        <>
          <div className="propertiesline">
            Some work in here
            {controlSettings.buildings.listOfAddedBuildings.map((elem, ind) => {
              return (
                <Button
                  pressed={instrument === elem.alt}
                  src={elem.src}
                  type="controls"
                  key={ind}
                  alt={elem.alt}
                  buttonClick={onButtonClick}></Button>
              );
            })}
          </div>
          <hr />
          <div className="propertieswords">
            <Button
              pressed={instrument === "n"}
              src=""
              type="controls"
              alt="n"
              buttonClick={buttonClick}>
              Delete
            </Button>
            <Button
              pressed={instrument === "addnew"}
              src=""
              type="controls"
              alt="addnew"
              buttonClick={buttonClick}>
              Add New
            </Button>
          </div>
          <hr />
          <div className="propertiesline">
            <label>
              <input
                type="checkbox"
                checked={controlSettings.buildings.isSlidlyPlacing}
                value={controlSettings.buildings.isSlidlyPlacing}
                onChange={() => {
                  setControlSettings({
                    ...controlSettings,
                    buildings: {
                      ...controlSettings.buildings,
                      isSlidlyPlacing:
                        !controlSettings.buildings.isSlidlyPlacing,
                    },
                  });
                }}
              />
              Slidely placing (like brush)
            </label>
          </div>
        </>
      )}
      {tool === "selection" && (
        <>
          <div className="propertieswords">
            <Button
              pressed={instrument === ""}
              src=""
              type="controls"
              alt="deselect"
              buttonClick={deselect}>
              Deselect
            </Button>
            <Button
              pressed={instrument === ""}
              src=""
              type="controls"
              alt="deselect"
              buttonClick={removeState}>
              Remove state
            </Button>
          </div>
          <hr />
          <div className="propertiesline">
            <div className="propertiesline">
              {controlSettings.selection.listOfLastColors.map((elem, ind) => {
                return (
                  <Button
                    pressed={controlSettings.selection.selectionColor === elem}
                    src={"./icons/freeicon.png"}
                    type="controls"
                    key={ind}
                    style={{ backgroundColor: elem }}
                    alt={elem}
                    buttonClick={onColorSelecting}></Button>
                );
              })}
            </div>
            <br />
            <div className="propertiesline">
              <input type="text" data-coloris id="selectioncoloris"></input>
            </div>
          </div>
          <hr />
          <div className="propertiesline">
            <label>
              <input
                type="checkbox"
                value={controlSettings.selection.isOnlyInZoneChanging}
                checked={controlSettings.selection.isOnlyInZoneChanging}
                onChange={() => {
                  setControlSettings({
                    ...controlSettings,
                    selection: {
                      ...controlSettings.selection,
                      isOnlyInZoneChanging:
                        !controlSettings.selection.isOnlyInZoneChanging,
                    },
                  });
                }}
              />
              Only in zone changes
            </label>
            <label>
              <input
                type="checkbox"
                value={controlSettings.selection.isReversSelectionOn}
                checked={controlSettings.selection.isReversSelectionOn}
                onChange={() => {
                  // console.log(controlSettings.selection.isReversSelectionOn);
                  setControlSettings({
                    ...controlSettings,
                    selection: {
                      ...controlSettings.selection,
                      isReversSelectionOn:
                        !controlSettings.selection.isReversSelectionOn,
                    },
                  });
                }}
              />
              Reverse selection (hold alt)
            </label>
          </div>
        </>
      )}
      {tool === "zooming" && (
        <>
          <div className="propertiesline">
            <label>
              Scale:{" "}
              <input
                className="propertiesnumberinput"
                type="number"
                value={controlSettings.zooming.scale}
                step={controlSettings.zooming.scaleKoefficent}
                onChange={(e) => {
                  if (e.target.value > 0 || e.target.value === "")
                    setControlSettings({
                      ...controlSettings,
                      zooming: {
                        ...controlSettings.zooming,
                        scale: e.target.value,
                      },
                    });
                }}
              />
            </label>
          </div>
          <div className="propertiesline">
            <label>
              Scale koefficent:{" "}
              <input
                className="propertiesnumberinput"
                type="number"
                step={0.1}
                value={controlSettings.zooming.scaleKoefficent}
                onChange={(e) => {
                  if (e.target.value >= 0)
                    setControlSettings({
                      ...controlSettings,
                      zooming: {
                        ...controlSettings.zooming,
                        scaleKoefficent: e.target.value,
                      },
                    });
                }}
              />
            </label>
          </div>
        </>
      )}
      {tool === "hand" && (
        <>
          {controlSettings.hand.listOfShortCuts.map((elem, ind) => {
            return (
              <div className="propertiesline" key={ind}>
                {elem}
              </div>
            );
          })}
        </>
      )}
      {tool === "brush" && (
        <>
          <div className="propertiesline">
            {controlSettings.brush.listOfLastColors.map((elem, ind) => {
              return (
                <Button
                  pressed={instrument === elem}
                  src={"./icons/freeicon.png"}
                  type="controls"
                  key={ind}
                  style={{ backgroundColor: elem }}
                  alt={elem}
                  buttonClick={onButtonClick}></Button>
              );
            })}
          </div>
          <div className="propertiesline">
            <input type="text" data-coloris id="brushcoloris"></input>
          </div>
          <hr />
          <div className="propertiesline">
            <label>
              Brush size:
              <input
                type="number"
                className="propertiesnumberinput"
                value={controlSettings.brush.brushSize}
                onChange={(e) => {
                  if (e.target.value >= 0.1 || e.target.value === "")
                    setControlSettings({
                      ...controlSettings,
                      brush: {
                        ...controlSettings.brush,
                        brushSize: e.target.value,
                      },
                    });
                }}
              />
            </label>
            <div>Slider</div>
          </div>
        </>
      )}
      {tool === "mouse" && (
        <>
          <div className="propertiesline">
            {controlSettings.mouse.zoneSelected !== ""
              ? controlSettings.mouse.zoneSelected
              : "Select zone"}
          </div>
          <hr />
          <div className="propertiesline">Input name of state</div>
          <div className="propertiesline">Select imperator</div>
          <div className="propertiesline">Pick border color</div>
          <hr />
          <div className="propertiesline">Information</div>
        </>
      )}
      {tool === "states" && (
        <>
          <div className="propertiesline">
            <Button buttonClick={selectState}>{selectedState}</Button>
            <ButtonList
              shown={selectStateListShown}
              pressedButton={selectedState}
              top={listCoordinates.top}
              left={listCoordinates.left}
              list={states}
              buttonClick={changeSelectedState}></ButtonList>
            <Button
              buttonClick={() =>
                makeAlert(
                  "New state",
                  <div className="alertinputs">
                    <input
                      type="text"
                      maxLength={50}
                      size={20}
                      ref={alertInputRef}
                    />
                  </div>,
                  () => {
                    alert(alertInputRef.current?.value);
                  }
                )
              }>
              Add new state
            </Button>
          </div>
          <hr />
          <div className="propertiesline">Name of state</div>
          <div className="propertiesline">Imperator</div>
          <div className="propertiesline">Info</div>
        </>
      )}
      {tool === "imperators" && (
        <>
          <div className="propertiesline">List of imperator</div>
          <div className="propertiesline">Add new imperator</div>
          <hr />
          <div className="propertiesline">Name of Imperator</div>
          <div className="propertiesline">Info</div>
        </>
      )}
    </div>
  );
};

export default Properties;
