import { Box, Divider, Modal, Stack, Text } from "@mantine/core";
import { AudioSearchFilters, SearchForm } from "./SearchForm";
import React from "react";
import { Link } from "react-router-dom";
import { getFilename } from "../utils";

interface Props {
  audios: ListAudio[];
  opened: boolean;
  onClose: () => void;
  onSearch: (newSearch: AudioSearchFilters) => void;
}

export function SearchModal(props: Props) {
  return (
    <Modal
      title="Search by audio transcription"
      p="md"
      size="xl"
      opened={props.opened}
      onClose={props.onClose}
    >
      <SearchForm onSearch={props.onSearch} />
      <Stack mt="md">
        {props.audios?.map((audio, i) => (
          <React.Fragment key={audio.id}>
            {i !== 0 ? <Divider /> : null}
            <Box>
              <Text component={Link} to={`/audios/${audio.id}`} fw="bold">
                {getFilename(audio.file)}
              </Text>
              <Text c="dimmed">{audio.project_name}</Text>
            </Box>
          </React.Fragment>
        ))}
      </Stack>
    </Modal>
  )
}
