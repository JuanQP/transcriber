import axios from "axios";
import { BACKEND_URL } from "../constants";

type AudioCreateSchema = {
  folder: number;
  file: File;
}

export async function create(values: AudioCreateSchema) {
  const formData = new FormData()
  formData.append("folder", String(values.folder))
  formData.append("file", values.file)

  const { data } = await axios.post<ListAudio>(`${BACKEND_URL}/audios/`, formData)
  return data
}

export async function get(id: ID) {
  const { data } = await axios.get<Audio>(`${BACKEND_URL}/audios/${id}/`)
  return data
}

export async function getAll(params: any) {
  const { data } = await axios.get<Audio[]>(`${BACKEND_URL}/audios/`, {
    params
  })
  return data
}

export async function remove(id: ID) {
  await axios.delete(`${BACKEND_URL}/audios/${id}/`)
}

export async function reprocess(id: ID) {
  const { data } = await axios.post<MessageResponse>(`${BACKEND_URL}/audios/${id}/reprocess/`)
  return data
}
