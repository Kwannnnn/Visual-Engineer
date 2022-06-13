import axios from 'axios';
import IBoard from '../../typings/IBoard';
import IObjectContext from '../../typings/IObjectContext';

const url = process.env.REACT_APP_API_URL;

export async function getAllBoards() {
  await axios.get(`${url}/v1/boards`)
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function getBoardById(id: number) {
  await axios.get(`${url}/v1/boards/${id}`)
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function getBoardObjects(id: number) {
  const response = await axios.get(`${url}/v1/boards/${id}/objects`);
  const objects = response.data.map((object: IObjectContext) => ({
    ...object,
  }));
  return objects;
}

export async function createBoard(properties: Partial<IBoard>) {
  await axios.post(`${url}/v1/boards/`, {
    ...properties,
  })
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function createItem(boardId: number, properties: Partial<IObjectContext>) {
  const result = await axios.post(`${url}/v1/boards/${boardId}/objects/`, {
    ...properties,
  })
    .then((response) => response.data)
    .catch((err) => err.data);

  return result;
}

export async function updateBoard(id: number, properties: Partial<IBoard>) {
  await axios.patch(`${url}/v1/boards/${id}`, {
    ...properties,
  })
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function updateBoardObject(
  boardId: number,
  itemTag: string,
  properties: Partial<IObjectContext>
) {
  const response = await axios.patch(`${url}/v1/boards/${boardId}/objects/${itemTag}`, {
    ...properties,
  });
  return response.data;
}

export async function deleteBoard(id: number) {
  await axios.delete(`${url}/v1/boards/${id}`)
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function deleteBoardObject(id: number, tag:string) {
  await axios.delete(`${url}/v1/boards/${id}/objects/${tag}`)
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function getObjectTypes() {
  const result = await axios.get(`${url}/v2/objects/types`)
    .then((response) => response.data)
    .catch((err) => err.data);

  return result;
}

export async function getTypeProperties(type: string) {
  const result = await axios.get(`${url}/v2/objects/types/${type}/properties`);
  return result.data;
}

export async function getObjectEdges() {
  const result = await axios.get(`${url}/v2/relationships`);
  return result.data;
}
