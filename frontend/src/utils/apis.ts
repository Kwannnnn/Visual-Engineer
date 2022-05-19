import axios from 'axios';
import { useState } from 'react';

const url = 'http://localhost:3000/api/v1/';

export function getAllBoards() {
  const [boards, setBoards] = useState('');
  axios.get(`${url}boards`)
    .then((response) => {
      setBoards(`${response.data}`);
    });
  return boards;
}

export function getBoardById(id: number) {
  const [name, setName] = useState('');
  axios.get(`${url}boards/${id}`)
    .then((response) => {
      setName(response.data.name);
    });
  const board = { id, name };
  return board;
}

export function getBoardObjects(id: number) {
  const [objects, setObjects] = useState('');
  axios.get(`${url}boards/${id}`)
    .then((response) => {
      setObjects(`${response.data}`);
    });
  return objects;
}

export function deleteBoard(id: number) {
  const [res, setRes] = useState(Number);
  axios.delete(`${url}boards/${id}`)
    .then((response) => {
      setRes(response.status);
    });
  return res;
}

export function deleteObjectFromBoard(id: number, tag: string) {
  axios.delete(`${url}boards/${id}/objects/${tag}`);
}
