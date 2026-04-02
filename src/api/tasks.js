import { api } from "./client.js";

const TASK_ENDPOINT = "/tasks";

export async function getTasks() {
  const { data } = await api.get(TASK_ENDPOINT);
  return data;
}

export async function createTask(task) {
  const { data } = await api.post(TASK_ENDPOINT, task);
  return data;
}

export async function updateTask(id, task) {
  const { data } = await api.put(`${TASK_ENDPOINT}/${id}`, task);
  return data;
}

export async function deleteTask(id) {
  const { data } = await api.delete(`${TASK_ENDPOINT}/${id}`);
  return data;
}
