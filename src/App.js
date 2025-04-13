/** @format */
// 2023 год, я в 10-11 классе
import Menu from "./elements/menu";
import Info from "./elements/info";
import Alert from "./elements/alert";
import Map from "./elements/map/map";
import History from "./elements/history";
import WindowWrapper from "./elements/window/window";
import Selector from "./elements/map/selector";
import Controlls from "./elements/map/controlls";
import Properties from "./elements/map/properties";
import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import "./App.css";

function App() {
  // console.log("App");

  const altPressed = useRef(false);
  const spacePressed = useRef(false);
  const toolRef = useRef("hand");
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState("hand");
  const [instrument, setInstrument] = useState("N");
  const [controlsShown, setControlsShown] = useState(true);
  const [confirmFunc, setConfirmFunc] = useState(() => {});

  const [states, setStates] = useState([{}]);
  const [imperators, setImperators] = useState([{}]);

  const [infoPosition, setInfoPosition] = useState({ top: null, left: null });
  const [controlSettings, setControlSettings] = useState({
    selection: {
      selectionColor: "#000000",
      isOnlyInZoneChanging: false,
      isReversSelectionOn: false,
      deselection: false,
      removingState: false,
      zoneChange: false,
      listOfLastColors: [],
    },
    buildings: {
      isSlidlyPlacing: false,
      listOfAddedBuildings: [],
    },
    brush: {
      listOfLastColors: [],
      brushSize: 1,
    },
    hand: {
      listOfShortCuts: [
        "H - hand tool",
        "S - selection tool",
        "B - brush tool",
        "Z - zoom tool",
        "Hold Space - move your mouse to change position of map",
      ],
    },
    zooming: {
      scale: 1,
      scaleKoefficent: 0.75,
    },
    mouse: {
      zoneSelected: "",
    },
  });
  const defaults = useMemo(() => {
    return {
      history: {
        position: {
          bottom: 0,
          left: 0,
          right: null,
          top: null,
        },
        size: {
          width: window.innerWidth,
          height: 58,
        },
        minSize: {
          width: 340,
          height: 58,
        },
      },
      controls: {
        position: {
          top: 50,
          left: 0,
          bottom: null,
          right: null,
        },
        size: {
          width: 60,
          height: 220,
        },
        minSize: { width: 30, height: 50 },
      },
      properties: {
        position: {
          top: 50,
          left: null,
          bottom: null,
          right: 0,
        },
        size: {
          width: 300,
          height: 270,
        },
        minSize: {
          width: 100,
          height: 100,
        },
      },
      info: {
        position: {
          top: infoPosition.top,
          left: infoPosition.left,
          bottom: infoPosition.top !== null ? null : 100,
          right: infoPosition.left !== null ? null : 0,
        },
        size: { width: 200, height: 300 },
        minSize: { width: 200, height: 300 },
      },
    };
  }, [infoPosition]);
  const [focus, setFocus] = useState("map");
  const [visibilityOrder, setVisibilityOrder] = useState([
    "History",
    "Properties",
    "...",
  ]);
  const [historyShown, setHistoryShown] = useState(true);
  const [infoShown, setInfoShown] = useState(false);
  const [propertiesShown, setPropertiesShown] = useState(true);
  const [alertShown, setAlertShown] = useState(false);

  const [alertName, setAlertName] = useState("...");
  const [alertContent, setAlertContent] = useState(<div>Nothing there</div>);

  const deselect = () => {
    setControlSettings({
      ...controlSettings,
      selection: { ...controlSettings.selection, deselection: true },
    });
  };

  const makeAlert = (
    name = "...",
    content = <div>Nothing there</div>,
    onConfirm
  ) => {
    setAlertShown(true);
    setAlertName(name);
    setAlertContent(content);
    setConfirmFunc(onConfirm);
  };

  const removeState = () => {
    setControlSettings({
      ...controlSettings,
      selection: { ...controlSettings.selection, removingState: true },
    });
  };

  // Window Events -- key ---- v
  const onKeyDown = (e) => {
    // console.log("Down", e.key);
    if (e.key === " " && !spacePressed.current) {
      spacePressed.current = true;
    }
    if (e.key === "Alt" && !altPressed.current) {
      altPressed.current = true;
      // console.log("down", controlSettings.selection.isReversSelectionOn);
      setControlSettings({
        ...controlSettings,
        selection: { ...controlSettings.selection, isReversSelectionOn: true },
      });
    }
    if (e.key === "H") {
      setTool("hand");
      toolRef.current = "hand";
    }
    if (e.key === "z") {
      setTool("zooming");
      toolRef.current = "zooming";
    }
    if (e.key === "b") {
      setTool("brush");
      toolRef.current = "brush";
    }
    if (e.key === "s") {
      setTool("selection");
      toolRef.current = "selection";
    }
  };
  const onKeyUp = (e) => {
    // console.log("Up", e.key);
    if (e.key === " ") {
      spacePressed.current = false;
    }
    if (e.key === "Alt") {
      altPressed.current = false;
      // console.log("up", controlSettings.selection.isReversSelectionOn);

      setControlSettings({
        ...controlSettings,
        selection: {
          ...controlSettings.selection,
          isReversSelectionOn: false,
        },
      });
    }
  };
  const onKeyPresses = (e) => {
    if (e.keyCode === 32 && e.target === document.body) e.preventDefault();
  };
  const disableSelect = (e) => {
    e.preventDefault();
  }; // Window Events -- key - ^

  // Window Events -- declaration ----- v
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keypress", onKeyPresses);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("selectstart", disableSelect);

    // Clean up function
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keypress", onKeyPresses);
      window.removeEventListener("selectstart", disableSelect);
    };
  }); // Window Events -- declaration - ^

  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  // Wrapper Window Events - v
  const closeControls = useCallback(() => {
    setControlsShown(false);
  }, [setControlsShown]);
  // Wrapper Window Events - ^

  return (
    <div className="App">
      <Menu></Menu>
      <Map
        zoom={zoom}
        tool={tool}
        focus={focus}
        setZoom={setZoom}
        setTool={setTool}
        setFocus={setFocus}
        instrument={instrument}
        setInstrument={setInstrument}
        altPressed={altPressed.current}
        visibilityOrder={visibilityOrder}
        controlSettings={controlSettings}
        spacePressed={spacePressed.current}
        setControlSettings={setControlSettings}
        setVisibilityOrder={setVisibilityOrder}></Map>
      <WindowWrapper
        name="..."
        tool={tool}
        focus={focus}
        setFocus={setFocus}
        changeTool={setTool}
        component={Controlls}
        shown={controlsShown}
        instrument={instrument}
        setControlFocus={setFocus}
        setInfoShown={setInfoShown}
        closeWindow={closeControls}
        changeInstrument={setInstrument}
        specifications={defaults.controls}
        visibilityOrder={visibilityOrder}
        setVisibilityOrder={setVisibilityOrder}>
        {""}
      </WindowWrapper>
      <WindowWrapper
        name="History"
        setFocus={setFocus}
        visibilityOrder={visibilityOrder}
        setVisibilityOrder={setVisibilityOrder}
        specifications={defaults.history}
        shown={historyShown}
        closeWindow={() => setHistoryShown(false)}>
        <History setFocus={setFocus}></History>
      </WindowWrapper>
      <WindowWrapper
        name="Properties"
        setFocus={setFocus}
        visibilityOrder={visibilityOrder}
        setVisibilityOrder={setVisibilityOrder}
        specifications={defaults.properties}
        shown={propertiesShown}
        closeWindow={() => setPropertiesShown(false)}>
        <Properties
          tool={tool}
          focus={focus}
          setFocus={setFocus}
          instrument={instrument}
          setInstrument={setInstrument}
          deselect={deselect}
          removeState={removeState}
          buttonClick={(newInstrument) => {
            setInstrument(newInstrument);
          }}
          colorSelecting={(clr) => {
            setControlSettings({
              ...controlSettings,
              selection: {
                ...controlSettings.selection,
                selectionColor: clr,
                zoneChange: true,
              },
            });
          }}
          controlSettings={controlSettings}
          setControlSettings={setControlSettings}
          states={states}
          setStates={setStates}
          imperators={imperators}
          setImperators={setImperators}
          makeAlert={makeAlert}></Properties>
      </WindowWrapper>
      <Selector
        tool={tool}
        focus={focus}
        instrument={instrument}
        exceptions={!spacePressed.current}></Selector>
      <WindowWrapper
        name="Helper"
        setFocus={setFocus}
        visibilityOrder={visibilityOrder}
        setVisibilityOrder={setVisibilityOrder}
        specifications={defaults.info}
        shown={infoShown}
        closeWindow={() => {
          setInfoShown(false);
        }}>
        <Info setInfoPosition={setInfoPosition} tool={tool}></Info>
      </WindowWrapper>
      <Alert
        shown={alertShown}
        name={alertName}
        confirmAvailable={true}
        confirm={confirmFunc}>
        {alertContent}
      </Alert>
    </div>
  );
}

export default App;

// --- z-indexes ---
/*
  default - 0: map, menu
  1-2: window 4
  3-4: window 3
  5-6: window 2
  7-8: window 1
*/
