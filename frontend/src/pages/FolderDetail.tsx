import { Loader, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import * as folderService from "../services/folderService"

export function FolderDetail() {
  const { id } = useParams()
  const { data: folder } = useQuery({
    queryKey: ["folders", id],
    queryFn: () => folderService.get(id!)
  })

  if(!folder) {
    return <Loader />
  }

  return (
    <Stack>
      <Title>{folder.project_name}</Title>
      <Text>You can upload files here in order to get them transcribed.</Text>
    </Stack>
  )
}
