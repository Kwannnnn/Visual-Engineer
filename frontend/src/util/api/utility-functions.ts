import axios from 'axios';
import IBoard from '../../typings/IBoard';
import IObjectContext from '../../typings/IObjectContext';
import IOConnectionContext from '../../typings/IOConnectionContext';

const url = process.env.REACT_APP_API_URL;

export async function getAllBoards() {
  await axios.get(`${url}/v1/boards`)
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function getBoardById(boardId: number) {
  await axios.get(`${url}/v1/boards/${boardId}`)
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function getBoardObjects(boardId: number) {
  const response = await axios.get(`${url}/v1/boards/${boardId}/objects`);
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
    .catch((err) => {
      throw err;
    });

  return result;
}

export async function updateBoard(boardId: number, properties: Partial<IBoard>) {
  await axios.patch(`${url}/v1/boards/${boardId}`, {
    ...properties,
  })
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function updateBoardObject(
  boardId: number,
  objectId: string,
  properties: Partial<IObjectContext>
) {
  const response = await axios.patch(`${url}/v1/boards/${boardId}/objects/${objectId}`, {
    ...properties,
  });
  return response.data;
}

export async function deleteBoard(boardId: number) {
  await axios.delete(`${url}/v1/boards/${boardId}`)
    .then((response) => response.data)
    .catch((err) => err.data);
}

export async function deleteBoardObject(boardId: number, objectId: string) {
  await axios.delete(`${url}/v1/boards/${boardId}/objects/${objectId}`)
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

export async function createRelationship(tags: Partial<IOConnectionContext>) {
  const result = await axios.post(`${url}/v2/relationships/`, {
    ...tags,
  })
    .then((response) => response.data)
    .catch((err) => err.data);

  return result;
}

export async function updateRelationship(
  pipelineId: string,
  firstItem: string,
  secondItem: string
) {
  const response = await axios.patch(`${url}/v2/relationships/${pipelineId}`, {
    firstItem,
    secondItem,
  });
  return response.data;
}
