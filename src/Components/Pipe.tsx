import React, { FC } from "react";
import "../App.css";

export interface PipeProps {
  x: number;
  height: number[];
  type: string;
}

const Pipe: FC<PipeProps> = ({ x, height, type }) => {
  const y = type === "bot" ? { height: height[0] } : { height: height[1] };
  const style = Object.assign({ left: `${x}px` }, y);
  const cName = type === "bot" ? "Pipe bottom" : "Pipe top";
  return <div className={cName} style={style} />;
};

export default Pipe;
