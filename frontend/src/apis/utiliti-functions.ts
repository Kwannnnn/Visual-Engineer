import axios from 'axios';
import { useEffect, useState } from 'react';

const url = 'http://localhost:3000/api/v1/';

export function getAllBoards() {
  const [boards, setBoards] = useState<any[]>();
  useEffect(() => {
    axios.get(`${url}boards`)
      .then((response) => {
        setBoards(response.data);
      });
  }, []);
  return boards;
}

export function getBoardById(id: number) {
  const [name, setName] = useState('');
  const [boardId, setId] = useState('');
  axios.get(`${url}boards/${id}`)
    .then((response) => {
      setName(response.data.name);
      setId(response.data.id);
    });
  const board = { boardId, name };
  return board;
}

export function getBoardObjects(id: number) {
  const [objects, setObjects] = useState<any[]>();
  useEffect(() => {
    axios.get(`${url}boards/${id}/objects`)
      .then((response) => {
        setObjects(response.data);
      });
  }, []);
  return objects;
}

export function updateBoard(id: number) {
  const [name, setName] = useState('');
  const sendData = () => {
    axios.patch(`${url}boards/${id}`, {
      name,
    });
  };
}

export function updateBoardObject(id: number, tag:string) {
  const [name, setName] = useState('');
  const sendData = () => {
    axios.patch(`${url}boards/${id}`, {
      name,
    });
  };
}

export function createBoard() {
  const [name, setName] = useState('');
  const sendData = () => {
    axios.post(`${url}boards/`, {
      name,
    });
  };
}

export function createBoardObject(id: number) {
  const [name, setName] = useState('');
  const sendData = () => {
    axios.post(`${url}boards/${id}`, {
      name,
    });
  };
}

export function deleteBoard(id: number) {
  axios.delete(`${url}boards/${id}`);
  // FIXME: research a neater way to reload the data
  return window.location.reload();
}

export function deleteBoardObject(id: number, tag:string) {
  axios.delete(`${url}boards/${id}/objects/${tag}`);
  // FIXME: research a neater way to reload the data
  return window.location.reload();
}
