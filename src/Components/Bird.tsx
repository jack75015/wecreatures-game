import React, { FC } from "react";
import "../App.css";

interface BirdProps {
  top: number;
}

const Bird: FC<BirdProps> = ({ top }) => {
  const style = { top: `${top}px` };

  return (
    <>
      <img className="Bird" style={style} src="bird.png" alt="Paris" />
    </>
  );
};

export default Bird;
