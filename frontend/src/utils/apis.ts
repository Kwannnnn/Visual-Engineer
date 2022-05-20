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
  axios.get(`${url}boards/${id}`)
    .then((response) => {
      setName(response.data.name);
    });
  const board = { id, name };
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
