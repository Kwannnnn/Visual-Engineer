import axios from 'axios';
import IBoard from '../typings/IBoard';
import IObjectContext from '../typings/IObjectContext';

const url = process.env.REACT_APP_API_URL;
const urlV2 = 'http://localhost:3000/api/v2';

export async function getAllBoards() {
  await axios.get(`${url}/boards`)
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function getBoardById(id: number) {
  await axios.get(`${url}/boards/${id}`)
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function getBoardObjects(id: number) {
  const response = await axios.get(`${url}/boards/${id}/objects`);
  const objects = response.data.map((object: IObjectContext) => ({
    ...object,
  }));
  return objects;
}

export async function createBoard(properties: Partial<IBoard>) {
  await axios.post(`${url}/boards/`, {
    ...properties,
  })
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function createItem(boardId: number, properties: Partial<IObjectContext>) {
  await axios.post(`${url}/boards/${boardId}/objects/`, {
    ...properties,
  })
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function updateBoard(id: number, properties: Partial<IBoard>) {
  await axios.patch(`${url}/boards/${id}`, {
    ...properties,
  })
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function updateBoardObject(
  boardId: number,
  itemTag: string,
  properties: IObjectContext
) {
  await axios.patch(`${url}/boards/${boardId}/objects/${itemTag}`, {
    ...properties,
  })
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function deleteBoard(id: number) {
  await axios.delete(`${url}/boards/${id}`)
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function deleteBoardObject(id: number, tag:string) {
  await axios.delete(`${url}/boards/${id}/objects/${tag}`)
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function getObjectTypes() {
  const result = await axios.get(`${urlV2}/objects/types`)
    .then((response) => response.data)
    .catch((err) => err.data);

  return result;
}

export async function getTypeProperties(type: string) {
  const result = await axios.get(`${urlV2}/objects/types/${type}/properties`);
  return result.data;
}
