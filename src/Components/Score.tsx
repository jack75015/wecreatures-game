import React, { FC } from "react";
import "../App.css";

interface ScoreProps {
  score: number;
}

const Score: FC<ScoreProps> = ({ score }) => (
  <div className="Score">Score: {score}</div>
);

export default Score;
