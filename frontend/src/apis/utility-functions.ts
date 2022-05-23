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

export function getBoardById(id: number, errCallBack: (e: any) => void) {
  const [name, setName] = useState('');
  const [boardId, setId] = useState('');
  axios.get(`${url}boards/${id}`)
    .then((response) => {
      setName(response.data.name);
      setId(response.data.id);
    }).catch((e) => {
      errCallBack(e);
    });
  const board = { boardId, name };
  return board;
}

export function getBoardObjects(id: number, errCallBack: (e: any) => void) {
  const [objects, setObjects] = useState<any[]>();
  useEffect(() => {
    axios.get(`${url}boards/${id}/objects`)
      .then((response) => {
        setObjects(response.data);
      }).catch((e) => {
        errCallBack(e);
      });
  }, []);
  return objects;
}

export function createBoard(id: number, name: string, errCallBack: (e: any) => void) {
  axios.post(`${url}boards/`, {
    id,
    name,
  }).catch((e) => {
    errCallBack(e);
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
  lining: number,
  errCallBack: (e: any) => void
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
  }).catch((e) => {
    errCallBack(e);
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
  pressureClass: string,
  errCallBack: (e: any) => void
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
  }).catch((e) => {
    errCallBack(e);
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
  grossVolume: number,
  errCallBack: (e: any) => void
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
  }).catch((e) => {
    errCallBack(e);
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
  grossVolume: number,
  errCallBack: (e: any) => void
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
  }).catch((e) => {
    errCallBack(e);
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
  finalPower: number,
  errCallBack: (e: any) => void
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
  }).catch((e) => {
    errCallBack(e);
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
  finalPower: number,
  errCallBack: (e: any) => void
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
  }).catch((e) => {
    errCallBack(e);
  });
}

export function updateBoard(id: number, name: string, errCallBack: (e: any) => void) {
  axios.patch(`${url}boards/${id}`, {
    name,
  }).catch((e) => {
    errCallBack(e);
  });
}

export function updateBoardObject(
  id: number,
  tag: string,
  property: string,
  value: string,
  errCallBack: (e: any) => void
) {
  axios.patch(`${url}boards/${id}/objects/${tag}`, {
    [property]: value,
  }).catch((e) => {
    errCallBack(e);
  });
}

export function deleteBoard(id: number, errCallBack: (e: any) => void) {
  axios.delete(`${url}boards/${id}`).catch((e) => {
    errCallBack(e);
  });
}

export function deleteBoardObject(id: number, tag:string, errCallBack: (e: any) => void) {
  axios.delete(`${url}boards/${id}/objects/${tag}`).catch((e) => {
    errCallBack(e);
  });
}
