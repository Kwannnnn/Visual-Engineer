import React, { useState } from 'react';
import {
  Route, Routes, useNavigate, useLocation
} from 'react-router-dom';
import Modal from './components/modal/Modal';
import ModalType from './components/modal/ModalType.enum';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import IBoard from './typings/IBoard';
import { createBoard } from './util/api/utility-functions';

function App() {
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNewProjectName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProjectName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const boards: IBoard[] = JSON.parse(localStorage.getItem('boards') || '[]');

    createBoard({
      name: newProjectName,
    })
      .then((board: IBoard) => {
        boards.push(board);
        localStorage.setItem('currentBoard', board.id.toString());
        localStorage.setItem('boards', JSON.stringify(boards));
        setNewProjectName('');
        setShowModal(false);
        if (location.pathname === '/') {
          navigate(0);
        } else {
          navigate('/');
        }
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Unknown error');
      });
  };

  return (
    <div className="flex flex-col h-screen">
      <Routes>
        <Route
          path="/"
          element={<Navbar createNewProject={() => setShowModal(true)} />}
        >
          <Route index element={<Home />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
      </Routes>

      {showModal && (
        <Modal
          dataCY="new-project-modal"
          showModal={showModal}
          modalType={ModalType.Link}
          className="modal fixed z-10 inset-0 bg-slate-50 bg-opacity-70"
          buttonText="Create"
          title="Create new project"
          closeModal={() => setShowModal(false)}
          formId="new-project-form"
        >
          <form id="new-project-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Project Name"
              required
              value={newProjectName}
              onChange={(e) => handleNewProjectName(e)}
              className="focus:ring-2 focus:ring-wb-blue/60 outline-none border border-gray-300 rounded-lg bg-gray-200 text-slate-700 px-3 py-2 mt-3"
            />
          </form>
        </Modal>
      )}
    </div>
  );
}

export default App;
