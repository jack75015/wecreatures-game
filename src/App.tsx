import React, { Component, Fragment } from "react";
import "./App.css";
import Bird from "./Components/Bird";
import Pipe, { PipeProps } from "./Components/Pipe";
import Controls from "./Components/Controls";
import Score from "./Components/Score";
import { generatePipePairs, initialState } from "./utils";

interface IPipe {
  x: number;
  height: number[];
  id: number;
}

interface IState {
  gameRunning: boolean | string;
  minTop: number;
  maxBot: number;
  top: number;
  velocity: number;
  deltaTop: number;
  jumpDistance: number;
  timerId?: NodeJS.Timeout;
  pipes: IPipe[];
  scorePipe: boolean | number;
  score: number;
}

class App extends Component {
  state: IState = {
    gameRunning: false,
    minTop: 0,
    maxBot: 670,
    top: 60,
    velocity: 15,
    deltaTop: 0,
    jumpDistance: -5,
    timerId: undefined,
    pipes: [],
    scorePipe: false,
    score: 0,
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handlePress);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handlePress);
  }

  fall = () => {
    const { top, velocity, maxBot, deltaTop } = this.state;
    // update
    let deltaPos = deltaTop + velocity * 0.016;
    const newPos = top + deltaPos;
    // const newPos = top + velocity

    //return new pos
    return {
      newPos: newPos <= maxBot ? newPos : maxBot,
      newDeltaPos: deltaPos,
    };
  };

  jump = () => {
    const { top, jumpDistance, minTop } = this.state;
    const deltaPos = jumpDistance;
    const newPos = top + deltaPos;

    // this.setState({top: newPos >= minTop ? newPos : minTop})
    this.setState({
      top: newPos >= minTop ? newPos : minTop,
      deltaTop: deltaPos,
    });
  };

  updatePipes = () => {
    const { pipes } = this.state;
    // first remove out of bound pipes
    const cleaned = pipes.filter((p) => p.x >= -50);
    const missing = 4 - cleaned.length;
    let baseDistance = 1280;
    const copy = [...cleaned];
    for (let i = 0; i < missing; i++) {
      baseDistance += 451;
      const o = {
        x: baseDistance,
        id: Math.random(),
        height: generatePipePairs(),
      };
      copy.push(o);
    }
    // each block should take 2s
    const movePipes = copy.map((p) => Object.assign(p, { x: p.x - 12.66 }));
    return movePipes;
  };

  updateGame = (winningPipe: any) => {
    const { scorePipe, score } = this.state;
    const newScore = scorePipe && scorePipe !== winningPipe ? score + 1 : score;

    const newFallPosition = this.fall();
    const newPipes = this.updatePipes();

    this.setState({
      top: newFallPosition.newPos,
      pipes: newPipes,
      deltaTop: newFallPosition.newDeltaPos,
      scorePipe: winningPipe,
      score: newScore,
    });
  };

  checkGame = () => {
    const { top, pipes } = this.state;
    // check for collision
    // get pipe that is in possible range for collision,
    // an x value that goes from 20 to 120
    const collisionPipe = pipes.filter((p) => p.x >= 20 && p.x <= 120);
    if (collisionPipe.length) {
      const pipe = collisionPipe[0];
      const topLimit = pipe.height[1];
      // give 5 pixel of grace
      // game height - 50px of fixed gap + 5 px of grace = 675
      // minus bot pipe height gives the bot limit
      const botLimit = 670 - pipe.height[0];

      if (top <= topLimit - 5 || top >= botLimit + 5) {
        return this.stopGame();
      }
    }

    const winningPipe = pipes.filter((p) => p.x >= 0 && p.x <= 20);
    if (winningPipe.length) {
      return this.updateGame(winningPipe[0].id);
    }

    this.updateGame(false);
  };

  startGame = () => {
    const t = setInterval(() => this.checkGame(), 16.66);
    this.setState({ timerId: t, gameRunning: true });
  };

  stopGame = (pause?: boolean) => {
    const { timerId } = this.state;
    if (!timerId) {
      return console.error("no timer set");
    }

    clearInterval(timerId);
    const gameState = pause ? "pause" : false;
    this.setState({ gameRunning: gameState });
  };

  resetGame = () => {
    const { gameRunning } = this.state;
    if (gameRunning === "pause") {
      return this.startGame();
    }

    this.setState(initialState);
  };

  handlePress = (e: KeyboardEvent) => {
    const { gameRunning } = this.state;
    const kc = e.key;

    switch (kc) {
      case " ":
        if (gameRunning) {
          this.jump();
        }
        break;

      case "s":
        if (!gameRunning) {
          this.startGame();
        }
        break;

      case "r":
        if (!gameRunning) {
          this.resetGame();
        }
        break;

      case "p":
      default:
        if (gameRunning === "pause") {
          return this.startGame();
        }
        if (gameRunning) {
          this.stopGame(true);
        }
        break;
    }
  };

  render() {
    const { top, pipes, score } = this.state;
    return (
      <div className="App">
        <Score score={score} />
        <Controls />
        <Bird top={top} />
        {pipes.map((p) => (
          <Fragment key={p.id}>
            <Pipe {...p} type="top" />
            <Pipe {...p} type="bot" />
          </Fragment>
        ))}
      </div>
    );
  }
}

export default App;
