import React, { useState, useEffect } from 'react';
import { getAllBoards, getBoardById, getBoardObjects } from '../utils/apis';

interface BoardProps {
  className?: string;
}

function Api({ className }: BoardProps) {
  const boards = getAllBoards();
  const board = getBoardById(1);
  const boardObjects = getBoardObjects(1);
  return (
    <div className={`overflow-auto ${className}`}>
      <header className="App-header">
        <div>
          <h1>getAllBoards</h1>
          <div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                  </tr>
                </thead>
                {boards
                && (
                <tbody>
                  {boards.map((data) => (
                    <tr>
                      <td>{data.id}</td>
                      <td>{data.name}</td>
                    </tr>
                  ))}
                </tbody>
                )}
              </table>
            </div>
          </div>
          <br />
          <h1>getBoardById:</h1>
          <div>
            ID: {board.id} / Name: {board.name}
          </div>
          <br />
          <h1>getBoardObjects</h1>
          <div>{boardObjects}</div>
        </div>
      </header>
    </div>
  );
}

export default Api;
