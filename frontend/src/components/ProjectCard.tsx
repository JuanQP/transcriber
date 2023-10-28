import { ActionIcon, Flex, MantineStyleProp, Paper, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const SELECTED_STYLE: MantineStyleProp = (theme) => ({ borderColor: theme.colors.blue[6] })

interface Props {
  project: Project;
  isSelected: boolean;
  onClick: (id: number) => void;
  onEditClick: (id: number) => void;
}

export function ProjectCard(props: Props) {

  function handleEditClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation()
    props.onEditClick(props.project.id)
  }

  return (
    <Paper
      withBorder
      style={props.isSelected ? SELECTED_STYLE : undefined}
      key={props.project.id}
      shadow={props.isSelected ? "md" : "none"}
      p="md"
      onClick={() => props.onClick(props.project.id)}
    >
      <Flex justify="space-between" align="center">
        <Text
          inline
          component={Link}
          to={`/folders/${props.project.root_folder}`}
          fw="bold"
        >
          {props.project.name}
        </Text>
        <ActionIcon variant="subtle" onClick={handleEditClick}>
          <IconEdit />
        </ActionIcon>
      </Flex>
      <Text c="dimmed">{props.project.audio_count} audios</Text>
    </Paper>
  )
}
