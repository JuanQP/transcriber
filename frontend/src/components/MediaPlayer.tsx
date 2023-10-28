import { Box, BoxComponentProps } from "@mantine/core";
import classes from '../assets/hover.module.css';
interface Props {
  audio: Audio;
  style?: BoxComponentProps["style"]
}

export function MediaPlayer({ audio, style }: Props) {
  return (
    <Box
      controls
      component="video"
      bg="dark"
      style={style}
      src={audio.file}
      crossOrigin="anonymous"
      className={classes["media-player"]}
    >
      <track
        default
        kind="subtitles"
        label="Subtítulos"
        srcLang="es"
        src={audio.subtitles ?? undefined}
      />
    </Box>
  )
}
