import { ActionIcon, Badge, BadgeProps, Flex, Loader, MantineStyleProp, Paper, Text, rem } from "@mantine/core";
import { IconCheck, IconHourglass, IconRepeat } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { getFilename } from "../utils";
import classes from '../assets/hover.module.css';

const SELECTED_STYLE: MantineStyleProp = (theme) => ({ borderColor: theme.colors.blue[6] })

interface Props {
  audio: ListAudio;
  isSelected?: boolean;
  onClick: (id: number) => void;
  onRetranscribeClick: (id: number) => void;
}

const STATUS_BADGE: Record<AudioStatus, BadgeProps> = {
  FI: {
    color: "green",
    leftSection: <IconCheck style={{ width: rem(16), height: rem(16) }} />,
    children: "Finished"
  },
  PE: {
    color: "blue",
    leftSection: <IconHourglass style={{ width: rem(16), height: rem(16) }} />,
    children: "Pending"
  },
  TR: {
    color: "cyan",
    leftSection: <Loader type="bars" color="white" size="xs" />,
    children: "Transcribing"
  }
}

export function AudioCard({isSelected = false, ...props}: Props) {
  const filename = getFilename(props.audio.file)

  function handleTranscribeClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation()
    props.onRetranscribeClick(props.audio.id)
  }

  return (
    <Paper
      withBorder
      style={isSelected ? SELECTED_STYLE : undefined}
      key={props.audio.id}
      shadow={isSelected ? "md" : "none"}
      p="md"
      className={classes.hoverable}
      onClick={() => props.onClick(props.audio.id)}
    >
      <Flex justify="space-between" align="center">
        <Text
          inline
          component={Link}
          title={filename}
          to={props.audio.status === "FI" ? `/audios/${props.audio.id}` : "#"}
          fw="bold"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {filename}
        </Text>
        <ActionIcon title="Transcribe again" variant="subtle" onClick={handleTranscribeClick}>
          <IconRepeat />
        </ActionIcon>
      </Flex>
      <Badge {...STATUS_BADGE[props.audio.status]} />
    </Paper>
  )
}
