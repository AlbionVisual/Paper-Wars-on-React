/** @format */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { isEmpty } from "lodash";
import "./map.css";
import Cell from "./cell";

// Constant values
const sizeX = 96,
  sizeY = 96; // % 8 = 0

const buildDefaultWorld = (lines, columns) =>
  Array.from(Array(Math.floor(columns / 8)), () =>
    Array.from(Array(Math.floor(lines / 8)), () =>
      Array.from(Array(8), () =>
        Array.from(Array(8), () => ({
          terrain: "lightgreen",
          selected: false,
          zoneColor: "",
          building: "N",
          borders: ["", "", "", ""],
          coloredBorders: ["", "", "", ""],
        }))
      )
    )
  );

const Map = ({
  tool,
  focus,
  setFocus,
  instrument,
  controlSettings,
  setControlSettings,
}) => {
  // console.log("Map");

  // Variables refs - v
  const mousePressed = useRef(false);
  const altPressed = useRef(false);
  const spacePressed = useRef(false);
  const worldRef = useRef(buildDefaultWorld(sizeX, sizeY));
  const isSlidlyPlacingRef = useRef(false);
  const focusRef = useRef("");
  const toolRef = useRef("N");
  const instrumentRef = useRef("N");
  // Variables refs - ^

  // Variables states - v
  const [target, setTarget] = useState({});
  const [origin, setOrigin] = useState({});
  // Variables states - ^

  // Connections between components ------------------ v
  useEffect(() => {
    toolRef.current = tool;
    setTarget({});
    setOrigin(null);
  }, [tool]);

  useEffect(() => {
    setOrigin(null);
    setTarget({});
    instrumentRef.current = instrument;
  }, [instrument]); // Connections between components - ^

  const rerenderCell = useCallback((x, y) => {
    worldRef.current[Math.floor(y / 8)][Math.floor(x / 8)][y % 8] = [
      ...worldRef.current[Math.floor(y / 8)][Math.floor(x / 8)][y % 8],
    ];
    worldRef.current[Math.floor(y / 8)][Math.floor(x / 8)] = [
      ...worldRef.current[Math.floor(y / 8)][Math.floor(x / 8)],
    ];
    worldRef.current[Math.floor(y / 8)] = [
      ...worldRef.current[Math.floor(y / 8)],
    ];
  }, []);

  // Calculations with database ---- v
  const rebootSelections = useCallback(() => {
    // console.log("rebooting selections...");
    for (let i = 0; i < sizeX; i++)
      for (let k = 0; k < sizeY; k++) {
        let cell =
          worldRef.current[Math.floor(k / 8)][Math.floor(i / 8)][k % 8][i % 8];
        let leftCell =
          i > 0
            ? worldRef.current[Math.floor(k / 8)][Math.floor((i - 1) / 8)][
                k % 8
              ][(i - 1) % 8]
            : "";
        let rightCell =
          i < sizeX - 1
            ? worldRef.current[Math.floor(k / 8)][Math.floor((i + 1) / 8)][
                k % 8
              ][(i + 1) % 8]
            : "";
        let topCell =
          k > 0
            ? worldRef.current[Math.floor((k - 1) / 8)][Math.floor(i / 8)][
                (k - 1) % 8
              ][i % 8]
            : "";
        let bottomCell =
          k < sizeY - 1
            ? worldRef.current[Math.floor((k + 1) / 8)][Math.floor(i / 8)][
                (k + 1) % 8
              ][i % 8]
            : "";

        if (i > 0 && cell.selected !== leftCell.selected) {
          if (cell.borders[0] !== "left") {
            cell.borders[0] = "left";
            rerenderCell(i, k);
          }
        } else {
          if (cell.borders[0] !== "") {
            cell.borders[0] = "";
            rerenderCell(i, k);
          }
        }
        if (i < sizeX - 1 && cell.selected !== rightCell.selected) {
          if (cell.borders[1] !== "right") {
            cell.borders[1] = "right";
            rerenderCell(i, k);
          }
        } else {
          if (cell.borders[1] !== "") {
            cell.borders[1] = "";
            rerenderCell(i, k);
          }
        }
        if (k > 0 && cell.selected !== topCell.selected) {
          if (cell.borders[2] !== "top") {
            cell.borders[2] = "top";
            rerenderCell(i, k);
          }
        } else {
          if (cell.borders[2] !== "") {
            cell.borders[2] = "";
            rerenderCell(i, k);
          }
        }
        if (k < sizeY - 1 && cell.selected !== bottomCell.selected) {
          if (cell.borders[3] !== "bottom") {
            cell.borders[3] = "bottom";
            rerenderCell(i, k);
          }
        } else {
          if (cell.borders[3] !== "") {
            cell.borders[3] = "";
            rerenderCell(i, k);
          }
        }
        //And cells with no neighbour
        if (i === 0 && k < sizeY && cell.selected) {
          if (cell.borders[0] !== "left") {
            cell.borders[0] = "left";
            rerenderCell(i, k);
          }
        }
        if (i === sizeX - 1 && k < sizeY && cell.selected) {
          if (cell.borders[1] !== "right") {
            cell.borders[1] = "right";
            rerenderCell(i, k);
          }
        }
        if (k === 0 && i < sizeX && cell.selected) {
          if (cell.borders[2] !== "top") {
            cell.borders[2] = "top";
            rerenderCell(i, k);
          }
        }
        if (k === sizeY - 1 && i < sizeX && cell.selected) {
          if (cell.borders[3] !== "bottom") {
            cell.borders[3] = "bottom";
            rerenderCell(i, k);
          }
        }
      }
  }, [rerenderCell]); // !!! Very much conditions !!!
  const rebootColoredSelections = useCallback(() => {
    // console.log("rebooting selections...");
    for (let i = 0; i < sizeX; i++)
      for (let k = 0; k < sizeY; k++) {
        let cell =
          worldRef.current[Math.floor(k / 8)][Math.floor(i / 8)][k % 8][i % 8];
        let leftCell =
          i > 0
            ? worldRef.current[Math.floor(k / 8)][Math.floor((i - 1) / 8)][
                k % 8
              ][(i - 1) % 8]
            : "";
        let rightCell =
          i < sizeX - 1
            ? worldRef.current[Math.floor(k / 8)][Math.floor((i + 1) / 8)][
                k % 8
              ][(i + 1) % 8]
            : "";
        let topCell =
          k > 0
            ? worldRef.current[Math.floor((k - 1) / 8)][Math.floor(i / 8)][
                (k - 1) % 8
              ][i % 8]
            : "";
        let bottomCell =
          k < sizeY - 1
            ? worldRef.current[Math.floor((k + 1) / 8)][Math.floor(i / 8)][
                (k + 1) % 8
              ][i % 8]
            : "";

        if (i > 0 && cell.zoneColor !== leftCell.zoneColor) {
          if (cell.coloredBorders[0] !== "coloredLeft") {
            cell.coloredBorders[0] = "coloredLeft";
            rerenderCell(i, k);
          }
        } else {
          if (cell.coloredBorders[0] !== "") {
            cell.coloredBorders[0] = "";
            rerenderCell(i, k);
          }
        }
        if (i < sizeX - 1 && cell.zoneColor !== rightCell.zoneColor) {
          if (cell.coloredBorders[1] !== "coloredRight") {
            cell.coloredBorders[1] = "coloredRight";
            rerenderCell(i, k);
          }
        } else {
          if (cell.coloredBorders[1] !== "") {
            cell.coloredBorders[1] = "";
            rerenderCell(i, k);
          }
        }
        if (k > 0 && cell.zoneColor !== topCell.zoneColor) {
          if (cell.coloredBorders[2] !== "coloredTop") {
            cell.coloredBorders[2] = "coloredTop";
            rerenderCell(i, k);
          }
        } else {
          if (cell.coloredBorders[2] !== "") {
            cell.coloredBorders[2] = "";
            rerenderCell(i, k);
          }
        }
        if (k < sizeY - 1 && cell.zoneColor !== bottomCell.zoneColor) {
          if (cell.coloredBorders[3] !== "coloredBottom") {
            cell.coloredBorders[3] = "coloredBottom";
            rerenderCell(i, k);
          }
        } else {
          if (cell.coloredBorders[3] !== "") {
            cell.coloredBorders[3] = "";
            rerenderCell(i, k);
          }
        }
        //And cells with no neighbour
        if (i === 0 && k < sizeY && cell.zoneColor) {
          if (cell.coloredBorders[0] !== "coloredLeft") {
            cell.coloredBorders[0] = "coloredLeft";
            rerenderCell(i, k);
          }
        }
        if (i === sizeX - 1 && k < sizeY && cell.zoneColor) {
          if (cell.coloredBorders[1] !== "coloredRight") {
            cell.coloredBorders[1] = "coloredRight";
            rerenderCell(i, k);
          }
        }
        if (k === 0 && i < sizeX && cell.zoneColor) {
          if (cell.coloredBorders[2] !== "coloredTop") {
            cell.coloredBorders[2] = "coloredTop";
            rerenderCell(i, k);
          }
        }
        if (k === sizeY - 1 && i < sizeX && cell.zoneColor) {
          if (cell.coloredBorders[3] !== "coloredBottom") {
            cell.coloredBorders[3] = "coloredBottom";
            rerenderCell(i, k);
          }
        }
      }
  }, [rerenderCell]); // !!! Very much conditions !!! (copy)
  const terrainToColor = (terrain) => {
    switch (terrain) {
      case "river":
        return "Blue";
      case "forest":
        return "Darkgreen";
      case "plain":
        return "Lightgreen";
      case "disaster":
        return "Red";
      case "sands":
        return "Yellow";
      case "mountains":
        return "Lightgreen";
      default:
        return terrain;
    }
  }; // Calculations with database - ^

  // Main database v--------------------v (brush, buildings and selections)
  const world = useMemo(() => {
    // console.log("world rebuild");
    if (controlSettings.selection.zoneChange) {
      for (let i = 0; i < sizeX; i++)
        for (let k = 0; k < sizeY; k++) {
          if (
            worldRef.current[Math.floor(k / 8)][Math.floor(i / 8)][k % 8][i % 8]
              .selected
          ) {
            worldRef.current[Math.floor(k / 8)][Math.floor(i / 8)][k % 8][
              i % 8
            ].zoneColor = controlSettings.selection.selectionColor;
            rerenderCell(i, k);
          }
        }
      rebootColoredSelections();
      setControlSettings({
        ...controlSettings,
        selection: {
          ...controlSettings.selection,
          zoneChange: false,
          deselection: true,
          selectionColor: "",
        },
      });
    }
    if (controlSettings.selection.removingState) {
      for (let i = 0; i < sizeX; i++)
        for (let k = 0; k < sizeY; k++) {
          if (
            worldRef.current[Math.floor(k / 8)][Math.floor(i / 8)][k % 8][i % 8]
              .selected
          ) {
            worldRef.current[Math.floor(k / 8)][Math.floor(i / 8)][k % 8][
              i % 8
            ].zoneColor = "";
            rerenderCell(i, k);
          }
        }
      rebootColoredSelections();
      setControlSettings({
        ...controlSettings,
        selection: {
          ...controlSettings.selection,
          removingState: false,
          deselection: true,
        },
      });
    }
    if (controlSettings.selection.deselection) {
      for (let i = 0; i < sizeX; i++)
        for (let k = 0; k < sizeY; k++) {
          if (
            worldRef.current[Math.floor(k / 8)][Math.floor(i / 8)][k % 8][i % 8]
              .selected
          ) {
            worldRef.current[Math.floor(k / 8)][Math.floor(i / 8)][k % 8][
              i % 8
            ].selected = false;
            rerenderCell(i, k);
          }
        }
      rebootSelections();
      setControlSettings({
        ...controlSettings,
        selection: { ...controlSettings.selection, deselection: false },
      });
    }
    if (origin !== null && !spacePressed.current) {
      // Tools -- buildings
      if (tool === "buildings") {
        if (
          !isEmpty(target) &&
          !mousePressed.current &&
          origin.x === target.x &&
          origin.y === target.y
        ) {
          const [j, i] = [target.y, target.x];
          if (controlSettings.selection.isOnlyInZoneChanging) {
            if (
              worldRef.current[Math.floor(j / 8)][Math.floor(i / 8)][j % 8][
                i % 8
              ].selected
            ) {
              worldRef.current[Math.floor(j / 8)][Math.floor(i / 8)][j % 8][
                i % 8
              ].building = instrumentRef.current;
              rerenderCell(i, j);
              setOrigin(null);
              setTarget({});
            }
          } else {
            worldRef.current[Math.floor(j / 8)][Math.floor(i / 8)][j % 8][
              i % 8
            ].building = instrumentRef.current;
            rerenderCell(i, j);
            setOrigin(null);
            setTarget({});
          }
        }
        if (mousePressed.current && controlSettings.buildings.isSlidlyPlacing) {
          const [i, j] = [
            isEmpty(target) ? origin.x : target.x,
            isEmpty(target) ? origin.y : target.y,
          ];
          if (controlSettings.selection.isOnlyInZoneChanging) {
            if (
              worldRef.current[Math.floor(j / 8)][Math.floor(i / 8)][j % 8][
                i % 8
              ].selected
            ) {
              worldRef.current[Math.floor(j / 8)][Math.floor(i / 8)][j % 8][
                i % 8
              ].building = instrumentRef.current;
              rerenderCell(i, j);
            }
          } else {
            worldRef.current[Math.floor(j / 8)][Math.floor(i / 8)][j % 8][
              i % 8
            ].building = instrumentRef.current;
            rerenderCell(i, j);
          }
        }
      }
      // Tools -- brush
      if (tool === "brush" && mousePressed.current) {
        const [x, y] = isEmpty(target)
          ? [origin.x, origin.y]
          : [target.x, target.y];
        const size = controlSettings.brush.brushSize;

        for (let i = x - size; i < x + size; i++) {
          for (let j = y - size; j < y + size; j++) {
            if (
              (i - x) * (i - x) + (j - y) * (j - y) < size * size &&
              j >= 0 &&
              i >= 0 &&
              j < sizeY &&
              i < sizeX
            ) {
              const [xc, yc] = [Math.floor(i / 8), Math.floor(j / 8)];
              if (controlSettings.selection.isOnlyInZoneChanging) {
                if (worldRef.current[yc][xc][j % 8][i % 8].selected) {
                  worldRef.current[yc][xc][j % 8][i % 8].terrain =
                    terrainToColor(instrumentRef.current);
                  if (instrumentRef.current === "mountains") {
                    worldRef.current[yc][xc][j % 8][i % 8].building =
                      "mountains";
                  }
                  rerenderCell(i, j);
                }
              } else {
                worldRef.current[yc][xc][j % 8][i % 8].terrain = terrainToColor(
                  instrumentRef.current
                );
                if (instrumentRef.current === "mountains") {
                  worldRef.current[yc][xc][j % 8][i % 8].building = "mountains";
                }
                rerenderCell(i, j);
              }
            }
          }
        }
      }
      // Tool -- selections
      if (tool === "selection") {
        // console.log("Selection");
        if (instrumentRef.current === "select" && !isEmpty(target)) {
          const [Xmin, Xmax] =
            origin.x > target.x ? [target.x, origin.x] : [origin.x, target.x];
          const [Ymin, Ymax] =
            origin.y > target.y ? [target.y, origin.y] : [origin.y, target.y];
          for (let i = 0; i < sizeX; i++)
            for (let j = 0; j < sizeY; j++) {
              if (j <= Ymax && j >= Ymin && i <= Xmax && i >= Xmin) {
                worldRef.current[Math.floor(j / 8)][Math.floor(i / 8)][j % 8][
                  i % 8
                ].selected = true;
                rerenderCell(i, j);
              } else if (
                worldRef.current[Math.floor(j / 8)][Math.floor(i / 8)][j % 8][
                  i % 8
                ].selected
              ) {
                rerenderCell(i, j);
                worldRef.current[Math.floor(j / 8)][Math.floor(i / 8)][j % 8][
                  i % 8
                ].selected = false;
              }
            }
          setOrigin(null);
        }

        if (
          (instrumentRef.current === "add" ||
            instrumentRef.current === "remove") &&
          !isEmpty(target)
        ) {
          const [Xmin, Xmax] =
            origin.x > target.x ? [target.x, origin.x] : [origin.x, target.x];
          const [Ymin, Ymax] =
            origin.y > target.y ? [target.y, origin.y] : [origin.y, target.y];

          for (let i = Xmin; i <= Xmax; i++)
            for (let j = Ymin; j <= Ymax; j++) {
              if (
                (instrumentRef.current === "remove" &&
                  !controlSettings.selection.isReversSelectionOn) ||
                (instrumentRef.current === "add" &&
                  controlSettings.selection.isReversSelectionOn)
              ) {
                worldRef.current[Math.floor(j / 8)][Math.floor(i / 8)][j % 8][
                  i % 8
                ].selected = false;
                rerenderCell(i, j);
              } else {
                worldRef.current[Math.floor(j / 8)][Math.floor(i / 8)][j % 8][
                  i % 8
                ].selected = true;
                rerenderCell(i, j);
              }
            }
          setOrigin(null);
        } else if (
          !isEmpty(origin) &&
          (instrumentRef.current === "brushAdd" ||
            instrumentRef.current === "brushRemove")
        ) {
          let i, j;
          if (isEmpty(target)) {
            i = origin.x;
            j = origin.y;
          } else {
            i = target.x;
            j = target.y;
          }
          if (
            (instrumentRef.current === "brushAdd" &&
              !controlSettings.selection.isReversSelectionOn) ||
            (instrumentRef.current === "brushRemove" &&
              controlSettings.selection.isReversSelectionOn)
          ) {
            worldRef.current[Math.floor(j / 8)][Math.floor(i / 8)][j % 8][
              i % 8
            ].selected = true;
            rerenderCell(i, j);
          } else {
            worldRef.current[Math.floor(j / 8)][Math.floor(i / 8)][j % 8][
              i % 8
            ].selected = false;
            rerenderCell(i, j);
          }
        }
        rebootSelections();
      }
    }

    return worldRef.current;
  }, [
    target,
    origin,
    tool,
    controlSettings,
    setControlSettings,
    rerenderCell,
    rebootSelections,
    rebootColoredSelections,
  ]); // !!! So many times rebuilds !!!
  // Main database ^--------------------^

  // Zooming - v
  useEffect(() => {
    if (origin != null)
      if (
        tool === "zooming" &&
        origin.x === target.x &&
        origin.y === target.y &&
        !spacePressed.current
      ) {
        if (instrumentRef.current === "zoomout" || altPressed.current) {
          setControlSettings((prev) => {
            return {
              ...prev,
              zooming: {
                ...prev.zooming,
                scale: prev.zooming.scale * prev.zooming.scaleKoefficent,
              },
            };
          });
        } else {
          setControlSettings((prev) => {
            return {
              ...prev,
              zooming: {
                ...prev.zooming,
                scale: prev.zooming.scale / prev.zooming.scaleKoefficent,
              },
            };
          });
        }
        setOrigin(null);
        setTarget({});
      }
  }, [target, origin, tool, setControlSettings]);
  // Zooming - ^

  // Mouse - v
  useEffect(() => {
    if (origin !== null && !isEmpty(target)) {
      if (tool === "mouse" && target.x === origin.x && target.y === origin.y) {
        let x = target.x,
          y = target.y;

        setControlSettings((prev) => {
          return {
            ...prev,
            mouse: {
              ...prev.mouse,
              zoneSelected:
                worldRef.current[Math.floor(y / 8)][Math.floor(x / 8)][y % 8][
                  x % 8
                ].zoneColor,
            },
          };
        });

        setOrigin(null);
        setTarget({});
      }
    }
  }, [target, origin, tool, setControlSettings]);
  // Mouse - ^

  // Window Events -- mouse ---- v
  const onMouseUp = (e) => {
    mousePressed.current = false;
  };
  const onMouseDown = (e) => {
    (focus === "map" || focus === "...") && e.preventDefault();
  };
  // hand tool - v
  const onMouseMoved = (e) => {
    if (mousePressed.current && (tool === "hand" || spacePressed.current)) {
      window.scrollBy(-e.movementX, -e.movementY);
    }
  }; // Window Events -- mouse - ^

  // Window Events -- keyboard - v
  const onKeyDown = (e) => {
    if (e.key === " " && !spacePressed.current) {
      spacePressed.current = true;
    }
    if (e.key === "Alt" && !altPressed.current) {
      altPressed.current = true;
    }
  };
  const onKeyUp = (e) => {
    if (e.key === " ") {
      spacePressed.current = false;
    }
    if (e.key === "Alt") {
      altPressed.current = false;
    }
  }; // Window Events -- keyboard - ^

  // Window Events -- declaration ----- v
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMoved);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    // Clean up function
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousemove", onMouseMoved);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }); // Window Events -- declaration - ^
  useEffect(() => {
    focusRef.current = focus;
  }, [focus]);
  useEffect(() => {
    isSlidlyPlacingRef.current = controlSettings.buildings.isSlidlyPlacing;
  }, [controlSettings.buildings.isSlidlyPlacing]);

  // Map Events ---- v
  const mouseDown = useCallback(
    (x, y) => {
      if (focusRef.current !== "map") setFocus("map");

      mousePressed.current = true;
      setTarget({});
      if (!spacePressed.current) setOrigin({ x, y });
    },
    [setOrigin, setTarget, setFocus]
  );
  const mouseReleased = useCallback(
    (x, y) => {
      mousePressed.current = false;
      if (
        toolRef.current === "selection" &&
        (instrumentRef.current === "brushAdd" ||
          instrumentRef.current === "brushRemove")
      )
        setOrigin(null);
      setTarget({ x, y });
    },
    [setTarget, setOrigin]
  );
  const mouseOver = useCallback(
    (x, y) => {
      if (
        mousePressed.current &&
        !spacePressed.current &&
        (toolRef.current === "brush" ||
          (toolRef.current === "buildings" && isSlidlyPlacingRef.current) ||
          (toolRef.current === "selection" &&
            (instrumentRef.current === "brushAdd" ||
              instrumentRef.current === "brushRemove")))
      ) {
        setTarget({ x, y });
      }
    },
    [setTarget]
  ); // Map Events - ^

  return (
    <>
      <div
        className="map"
        style={{ transform: `scale(${controlSettings.zooming.scale})` }}>
        {world.map((chunkline, yc) => {
          return (
            <ChunkLine
              yc={yc}
              key={yc}
              chunkline={chunkline}
              mouseDown={mouseDown}
              mouseOver={mouseOver}
              mouseReleased={mouseReleased}></ChunkLine>
          );
        })}
      </div>
    </>
  );
};

export default Map;

const ChunkLine = memo(
  ({ chunkline, mouseDown, mouseReleased, mouseOver, yc }) => {
    // console.log("chunkline");
    return (
      <div className="chunkline" key={yc}>
        {chunkline.map((chunk, xc) => {
          return (
            <Chunk
              yc={yc}
              xc={xc}
              key={xc}
              chunk={chunk}
              mouseDown={mouseDown}
              mouseOver={mouseOver}
              mouseReleased={mouseReleased}></Chunk>
          );
        })}
      </div>
    );
  }
);

const Chunk = memo(({ chunk, mouseDown, mouseReleased, mouseOver, yc, xc }) => {
  // console.log("chunk");
  return (
    <div className="chunk" key={xc}>
      {chunk.map((line, y) => {
        return (
          <Line
            xc={xc}
            yc={yc}
            y={y}
            key={y}
            line={line}
            mouseDown={mouseDown}
            mouseOver={mouseOver}
            mouseReleased={mouseReleased}></Line>
        );
      })}
    </div>
  );
});

const Line = memo(
  ({ line, mouseDown, mouseReleased, mouseOver, xc, yc, y }) => {
    // console.log("Line");
    return (
      <div className="line" key={y}>
        {line.map((cell, x) => {
          return (
            <Cell
              key={xc * 10000 + yc * 100 + y * 10 + x}
              x={xc * 8 + x}
              y={yc * 8 + y}
              terrain={cell.terrain}
              building={cell.building}
              mousePressed={mouseDown}
              mouseReleased={mouseReleased}
              mouseOver={mouseOver}
              borders={cell.borders.join("") + cell.coloredBorders.join("")}
              borderColor={cell.zoneColor}
            />
          );
        })}
      </div>
    );
  }
);

// setState always same. Even if you re-render your component with this state it will be still the same

// useEffect(() => {
//   // console.log("settings changed"); work only when reverse changes !
// }, [controlSettings.selection.isReversSelectionOn]); // !!!!!! write to vacabluary !!!!!!
