import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllBoards, getBoardById, getBoardObjects,
  createBoard, createBoardObject, updateBoard, updateBoardObject,
  deleteBoard, deleteBoardObject
} from '../apis/utiliti-functions';

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
                    <th key="board-id">ID</th>
                    <th key="board-name">Name</th>
                    <th key="board-delte">DEL</th>
                    <th key="board-update">UP</th>
                  </tr>
                </thead>
                {boards
                && (
                <tbody>
                  {boards.map((data) => (
                    <tr>
                      <td key={data.id}>{data.id}</td>
                      <td key={data.name}>{data.name}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            deleteBoard(data.id);
                          }}
                        >del
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            updateBoard(data.id);
                          }}
                        >up
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                )}
              </table>
            </div>
          </div>
          <br />
          <h1>getBoardById(1):</h1>
          <div>
            ID: {board.boardId} / Name: {board.name}
          </div>
          <br />
          <h1>getBoardObjects</h1>
          <table>
            <thead>
              <tr>
                <th key="item-id">ID</th>
                <th key="item-name">Name</th>
                <th key="item-delte">DEL</th>
                <th key="item-update">UP</th>
              </tr>
            </thead>
            {boardObjects
                && (
                <tbody>
                  {boardObjects.map((data) => (
                    <tr>
                      <td key={data.tag}>{data.tag}</td>
                      <td key={data.name}>{data.name}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            deleteBoardObject(data.board, data.tag);
                          }}
                        >del
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            updateBoardObject(data.board.id, data.tag);
                          }}
                        >up
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                )}
          </table>
        </div>
      </header>
    </div>
  );
}

export default Api;
