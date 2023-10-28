import axios from "axios";
import { BACKEND_URL } from "../constants";
import { ProjectSchema } from "../components/ProjectForm";

export async function getAll() {
  const { data } = await axios.get<Project[]>(`${BACKEND_URL}/projects`)
  return data
}

export async function get(id: ID) {
  const { data } = await axios.get<Project>(`${BACKEND_URL}/projects/${id}`)
  return data
}

export async function create(values: ProjectSchema) {
  const { data } = await axios.post<Project[]>(`${BACKEND_URL}/projects/`, values)
  return data
}

export async function update(id: ID, values: ProjectSchema) {
  const { data } = await axios.patch<Project[]>(`${BACKEND_URL}/projects/${id}/`, values)
  return data
}

export async function remove(id: ID) {
  await axios.delete(`${BACKEND_URL}/projects/${id}/`)
}
