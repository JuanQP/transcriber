import { Button, FileButton, Flex, Loader, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import * as folderService from "../services/folderService"
import * as audioService from "../services/audioService"
import { IconTrash, IconUpload } from "@tabler/icons-react";
import { AudioCard } from "../components/AudioCard";
import { useState } from "react";

export function FolderDetail() {
  const { id } = useParams()
  const [selectedAudios, setSelectedAudios] = useState<number[]>([])
  const queryClient = useQueryClient()
  const { data: folder } = useQuery({
    queryKey: ["folders", id],
    queryFn: () => folderService.get(id!)
  })
  const audioUploadMutation = useMutation({
    mutationFn: audioService.create,
  })
  const deleteAudioMutation = useMutation({
    mutationFn: audioService.remove,
  })
  const reprocessAudioMutation = useMutation({
    mutationFn: audioService.reprocess,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["folders", id]})
    }
  })

  function handleAudioClick(id: number) {
    if(selectedAudios.includes(id)) {
      setSelectedAudios(previous => previous.filter(selectedId => selectedId !== id))
    } else {
      setSelectedAudios(previous => [...previous, id])
    }
  }

  async function handleAudioUpload(files: File[]) {
    await Promise.allSettled(
      files.map(file => audioUploadMutation.mutateAsync({ file, folder: Number(id) }))
    )
    queryClient.invalidateQueries({queryKey: ["folders", id]})
  }

  async function handleAudioDeleteClick() {
    await Promise.allSettled(selectedAudios.map((id) => deleteAudioMutation.mutateAsync(id)))
    queryClient.invalidateQueries({queryKey: ["folders", id]})
    setSelectedAudios([])
  }

  if(!folder) {
    return <Loader />
  }

  return (
    <Stack>
      <Title>{folder.project_name}</Title>
      <Text>You can upload audios or videos here to transcribe them.</Text>
      <Flex gap="md">
        <FileButton accept="audio/*,video/*" multiple onChange={handleAudioUpload}>
          {(props) => <Button {...props} color="green" leftSection={<IconUpload />}>Upload files</Button>}
        </FileButton>
        <Button
          disabled={selectedAudios.length === 0}
          leftSection={<IconTrash />}
          color="red"
          onClick={handleAudioDeleteClick}
        >
          Delete{selectedAudios.length === 0 ? " " : ` ${selectedAudios.length} `}audios
        </Button>
      </Flex>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        {folder.files.map(audio => (
          <AudioCard
            key={audio.id}
            audio={audio}
            isSelected={selectedAudios.includes(audio.id)}
            onClick={handleAudioClick}
            onRetranscribeClick={reprocessAudioMutation.mutate}
          />
        ))}
      </SimpleGrid>
    </Stack>
  )
}
