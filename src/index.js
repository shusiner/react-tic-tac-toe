import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const temp = props.winner + ' square color_' + String(props.value).toLowerCase() + ' '
  const className = props.bold ? temp + 'bold': temp;
  return (
    <button 
      className={className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const bold = this.props.stepAt === i ? true : false
    const line = this.props.winner
    const winner = line && line.includes(i) ? calculateWinner2(line) : ""
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        bold={bold}
        key={i}
        winner={winner}
      />
    );
  }

  render() {
    const n = 3
    const items=[]
    for(var i=0;i<n;i++){
      const items_temp = []
      for(var j=0;j<n;j++) {
        var k=i*n+j
        items_temp.push(this.renderSquare(k))
      }
      items.push(<div key={i} className="board-row">{items_temp}</div>)
    }
    return (
    <div>{items}</div>
    )
    // return (
    //   <div>
    //     <div className="board-row">
    //       {this.renderSquare(0)}
    //       {this.renderSquare(1)}
    //       {this.renderSquare(2)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(3)}
    //       {this.renderSquare(4)}
    //       {this.renderSquare(5)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(6)}
    //       {this.renderSquare(7)}
    //       {this.renderSquare(8)}
    //     </div>
    //   </div>
    // );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      asc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares, 0) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleToggle() {
    this.setState({
      asc: !this.state.asc,
    });
  }

  colRowMove(move, type) {
    if (move!==0) {
      const history = this.state.history;
      var a = history[move].squares;
      var b = history[move-1].squares;
      const dict = {
        0:"(Col:1,Row:1)",
        1:"(Col:2,Row:1)",
        2:"(Col:3,Row:1)",
        3:"(Col:1,Row:2)",
        4:"(Col:2,Row:2)",
        5:"(Col:3,Row:2)",
        6:"(Col:1,Row:3)",
        7:"(Col:2,Row:3)",
        8:"(Col:3,Row:3)",
      };
      for(var i=0;i<a.length;i++) 
        if(a[i]!==b[i])
          if(type === 0)
            return dict[i];
          else if(type === 1)
            return i;
    }
  }

  render() {
    const history = this.state.history;
    const step = this.state.stepNumber;
    const current = history[step];
    const winner = calculateWinner(current.squares, 0);

    const moves = history.map((_step, move) => {
      move = this.state.asc ? move : history.length-1 - move;
      const desc = move ?
        'Go to move #' + move + ' '+ this.colRowMove(move,0):
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = (step !== 9) ? 'Next player: ' + (this.state.xIsNext ? 'X' : 'O') : 'Draw';
    }
    let order = this.state.asc ? 'descending' : 'ascending';

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            stepAt={this.colRowMove(step,1)}
            winner={calculateWinner(current.squares, 1)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleToggle()}>
            Change to {order}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares, type) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return type === 0 ? squares[a] : lines[i];
    }
  }
  return null;
}

function calculateWinner2(line) {
  const lines = {
    "[0,1,2]":"winner horizontal",
    "[3,4,5]":"winner horizontal",
    "[6,7,8]":"winner horizontal",
    "[0,3,6]":"winner vertical",
    "[1,4,7]":"winner vertical",
    "[2,5,8]":"winner vertical",
    "[0,4,8]":"winner diag1",
    "[2,4,6]":"winner diag2",
  };
  return lines[JSON.stringify(line)]

  // does not work, cant compare arrays like this in javascript

  // const line1 = [[0,1,2],[3,4,5],[6,7,8]]
  // const line2 = [[0,3,6],[1,4,7],[2,5,8]]
  // const line3 = [[0,4,8]]
  // const line4 = [[2,4,6]]
  // if(line in line1)
  //   return "win_horizontal";
  // if(line in line2)
  //   return "win_vertical";
  // if(line in line3)
  //   return "win_diag1";
  // if(line in line4)
  //   return "win_diag2";
}

