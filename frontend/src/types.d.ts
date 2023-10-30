type ID = string | number;

type Project = {
  id: number;
  name: string;
  root_folder: number;
  owner: number;
  audio_count: number;
}

type LeafFolder = Pick<Folder, "id" | "name">

type Folder = {
  id: number;
  project: number;
  name: string;
  children: LeafFolder[];
  project_name: string;
}

type Audio = {
  id: number;
  project: number;
  folder: number;
  file: string;
  status: AudioStatus;
  subtitles: string | null;
  transcription: string;
  project_name: string;
  language: AudioLanguage
}

type AudioStatus = "PE" | "FI" | "TR"
type AudioLanguage = "english" | "hindi" | "spanish" | "simple"

/**
 * Audio shape used in lists
 */
type ListAudio = Pick<Audio, "id" | "project" | "folder" | "file" | "status" | "language" | "project_name">

type MessageResponse = {
  message: string;
}
