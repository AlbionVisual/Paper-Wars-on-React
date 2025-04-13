/** @format */
// 2023 год, я в 10-11 классе
import React, { memo } from "react";
import "./cell.css";

const Cell = memo(
  ({
    mousePressed,
    mouseReleased,
    mouseOver,
    width,
    height,
    x,
    y,
    terrain,
    building,
    borders,
    borderColor,
  }) => {
    // console.log("cell");
    const onMousePressed = () => {
      mousePressed && mousePressed(x, y);
    };

    const onMouseReleased = () => {
      mouseReleased && mouseReleased(x, y);
    };

    const onMouseOver = () => {
      mouseOver && mouseOver(x, y);
    };

    return (
      <div
        className={`cell`}
        onMouseDown={onMousePressed}
        onMouseUp={onMouseReleased}
        onMouseOver={onMouseOver}
        style={{
          backgroundColor: terrain,
          minWidth: width,
          maxWidth: width,
          height: height,
          borderRightColor: borders.includes("right")
            ? "black"
            : borders.includes("coloredRight")
            ? borderColor
            : "rgba(235, 235, 235, 0.459)",
          borderRightWidth: "0.5px",
          borderRightStyle: borders.includes("right") ? "dashed" : "solid",
          borderLeftColor: borders.includes("left")
            ? "black"
            : borders.includes("coloredLeft")
            ? borderColor
            : "rgba(235, 235, 235, 0.459)",
          borderLeftWidth: "0.5px",
          borderLeftStyle: borders.includes("left") ? "dashed" : "solid",
          borderBottomColor: borders.includes("bottom")
            ? "black"
            : borders.includes("coloredBottom")
            ? borderColor
            : "rgba(235, 235, 235, 0.459)",
          borderBottomWidth: "0.5px",
          borderBottomStyle: borders.includes("bottom") ? "dashed" : "solid",
          borderTopColor: borders.includes("top")
            ? "black"
            : borders.includes("coloredTop")
            ? borderColor
            : "rgba(235, 235, 235, 0.459)",
          borderTopWidth: "0.5px",
          borderTopStyle: borders.includes("top") ? "dashed" : "solid",
        }}>
        {building !== "N" ? (
          <img
            alt={building[0]}
            src={`./icons/${building.toLowerCase()}.png`}
            style={{ display: building !== "n" ? "block" : "none" }}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
);

export default Cell;

// Вся логика в большом паренте, простые элементы для отображения -
// тупые, принимают только то что нужно для отображения. Для их
// связи можно использовать коллбэки. Если происходит ненужный ререндер
// тупого компонента, то-есть пропсы "типо" не меняются, значит нужно
// проверить все пропсы, т.к. всё-таки какой-то пропс меняется (в memo)
