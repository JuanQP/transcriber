import axios from "axios";
import { BACKEND_URL } from "../constants";

export async function get(id: ID) {
  const { data } = await axios.get<Folder>(`${BACKEND_URL}/folders/${id}`)
  return data
}
