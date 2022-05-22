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

export function createBoard(id: number, name: string) {
  axios.post(`${url}boards/`, {
    id,
    name,
  });
}

export function createPipeline(
  boardId: number,
  tag: string,
  name: string,
  length: number,
  width: number,
  depth: number,
  diameter: number,
  type: string,
  pressureClass: string,
  flange: number,
  lining: number
) {
  axios.post(`${url}boards/${boardId}/objects/`, {
    tag,
    name,
    length,
    width,
    depth,
    diameter,
    type,
    pressureClass,
    flange,
    lining,
  });
}

export function createPipeFitting(
  boardId: number,
  tag: string,
  name: string,
  length: number,
  width: number,
  depth: number,
  diameter: number,
  type: string,
  pressureClass: string
) {
  axios.post(`${url}boards/${boardId}/objects/`, {
    tag,
    name,
    length,
    width,
    depth,
    diameter,
    type,
    pressureClass,
  });
}

export function createVessel(
  boardId: number,
  tag: string,
  name: string,
  length: number,
  width: number,
  depth: number,
  diameter: number,
  type: string,
  emptyMass: number,
  filledMass: number,
  head: number,
  netVolume: number,
  grossVolume: number
) {
  axios.post(`${url}boards/${boardId}/objects/`, {
    tag,
    name,
    length,
    width,
    depth,
    diameter,
    type,
    emptyMass,
    filledMass,
    head,
    netVolume,
    grossVolume,
  });
}

export function createTank(
  boardId: number,
  tag: string,
  name: string,
  length: number,
  width: number,
  depth: number,
  diameter: number,
  type: string,
  emptyMass: number,
  filledMass: number,
  head: number,
  netVolume: number,
  grossVolume: number
) {
  axios.post(`${url}boards/${boardId}/objects/`, {
    tag,
    name,
    length,
    width,
    depth,
    diameter,
    type,
    emptyMass,
    filledMass,
    head,
    netVolume,
    grossVolume,
  });
}

export function createBlower(
  boardId: number,
  tag: string,
  name: string,
  length: number,
  width: number,
  depth: number,
  diameter: number,
  type: string,
  preliminaryPower: number,
  finalPower: number
) {
  axios.post(`${url}boards/${boardId}/objects/`, {
    tag,
    name,
    length,
    width,
    depth,
    diameter,
    type,
    preliminaryPower,
    finalPower,
  });
}

export function createPump(
  boardId: number,
  tag: string,
  name: string,
  length: number,
  width: number,
  depth: number,
  diameter: number,
  type: string,
  preliminaryPower: number,
  finalPower: number
) {
  axios.post(`${url}boards/${boardId}/objects/`, {
    tag,
    name,
    length,
    width,
    depth,
    diameter,
    type,
    preliminaryPower,
    finalPower,
  });
}

export function updateBoard(id: number, name: string) {
  axios.patch(`${url}boards/${id}`, {
    name,
  });
}

export function updateBoardObject(id: number, tag: string, property: string, value: string) {
  axios.patch(`${url}boards/${id}/objects/${tag}`, {
    property: value,
  });
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
