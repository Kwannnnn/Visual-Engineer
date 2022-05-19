import React, { useState } from 'react';
import { getAllBoards, getBoardById } from './utils/apis';
import './App.css';

function App() {
  const boards = getAllBoards();
  const board = getBoardById(1);
  // const boardObjects = getBoardObjects(1);
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>getAllBoards</h1>
          <div>{boards}</div>
          <br />
          <h1>getBoardById:</h1>
          <div>
            ID: {board.id} / Name: {board.name}
          </div>
          <br />
          {/* <h1>getBoardObjects</h1>
          <div>{boardObjects}</div> */}
        </div>
      </header>
    </div>
  );
}

export default App;
