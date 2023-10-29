import { Anchor, Breadcrumbs, Card, Flex, Loader, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import * as audioService from "../services/audioService"
import { getFilename } from "../utils";
import { MediaPlayer } from "../components/MediaPlayer";

export function AudioDetail() {
  const { id } = useParams()
  const { data: audio } = useQuery({
    queryKey: ["audios", id],
    queryFn: () => audioService.get(id!)
  })

  if(!audio) {
    return <Loader />
  }

  return (
    <Stack>
      <Breadcrumbs style={{ flexWrap: "wrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        <Anchor component={Link} to={`/folders/${audio.folder}`} underline="never">
          <Title>{audio.project_name}</Title>
        </Anchor>
        <Title style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
          {getFilename(audio.file)}
        </Title>
      </Breadcrumbs>
      <Card component={Flex} justify="center" shadow="md">
        <MediaPlayer
          audio={audio}
          style={(theme) => ({
            objectFit: "contain",
            maxHeight: "50vh",
            borderRadius: theme.radius.md,
          })}
        />
      </Card>
      <Card shadow="md">
        <Text fw="bold">
          Transcription
        </Text>
        <Text>
          {audio.transcription}
        </Text>
      </Card>
    </Stack>
  )
}
