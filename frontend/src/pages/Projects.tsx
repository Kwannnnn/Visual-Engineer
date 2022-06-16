import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IBoard from '../typings/IBoard';
import {
  getAllBoards
} from '../util/api/utility-functions';
import useAPIUtil from '../util/hooks/useAPIUtil';

function Projects() {
  const [boardsState, setBoardsState] = useState<IBoard[]>([]);
  const getAllBoardsCallback = useCallback(async () => getAllBoards(), []);
  const { data: boardsData } = useAPIUtil<IBoard[]>(getAllBoardsCallback);

  const onClickHandler = (board: IBoard) => {
    const boards: IBoard[] = JSON.parse(localStorage.getItem('boards') || '[]');
    localStorage.setItem('currentBoard', board.id.toString());
    if (boards.find((b) => b.id === board.id)) return;
    boards.push(board);
    localStorage.setItem('boards', JSON.stringify(boards));
  };

  useEffect(() => {
    if (!boardsData) return;
    setBoardsState(boardsData);
  }, [boardsData]);

  return (
    <div className="flex-1 bg-slate-100 flex flex-col px-6 py-12">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Projects</h2>
        <p className="mb-8 text-slate-500">This is a list of all existing projects in the system.
          You can open a project by clicking one of the entries below.
        </p>
        <div>
          <div>
            <div className="grid grid-cols-12 text-slate-400 font-semibold mb-2">
              <span className="col-span-2 sm:col-span-1 pl-4">#</span>
              <span className="col-span-10 sm:col-span-11">Project name</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            {boardsState.map((board) => (
              <Link
                key={board.id}
                className="grid grid-cols-12 bg-white hover:bg-slate-50 border shadow-md shadow-slate-200 rounded-sm py-3 outline-slate-600 text-slate-800 cursor-pointer"
                to="/"
                onClick={() => onClickHandler(board)}
              >
                <span className="col-span-2 sm:col-span-1 pl-4">{board.id}</span>
                <span className="col-span-10 sm:col-span-11">{board.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
