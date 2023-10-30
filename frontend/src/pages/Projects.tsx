import { Button, Flex, Loader, Modal, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as audioService from "../services/audioService"
import * as projectService from "../services/projectService"
import { IconFolderPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectForm, ProjectSchema } from "../components/ProjectForm";
import { SearchModal } from "../components/SearchModal";


export function Projects() {
  const [selectedProjects, setSelectedProjects] = useState<number[]>([])
  const [isProjectModalOpened, setIsProjectModalOpened] = useState(false)
  const [audioSearchModalOpened, setAudioSearchModalOpened] = useState(false)
  const [editProjectId, setEditProjectId] = useState<number | null>(null)
  const [ftsSearch, setFtsSearch] = useState<audioService.AudioFTSFilters>({
    fts_search: "",
    project: null
  })
  const queryClient = useQueryClient()

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getAll,
    placeholderData: keepPreviousData
  })

  const { data: audios } = useQuery({
    queryKey: ["search", "projects", "audios", ftsSearch.fts_search],
    queryFn: () => audioService.search(ftsSearch),
    placeholderData: keepPreviousData,
    enabled: ftsSearch.fts_search !== "",
    initialData: []
  })

  const newProjectMutation = useMutation({
    mutationFn: projectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      setIsProjectModalOpened(false)
    }
  })

  const updateProjectMutation = useMutation({
    mutationFn: (args: Parameters<typeof projectService.update>) => projectService.update(...args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      setIsProjectModalOpened(false)
      setEditProjectId(null)
    }
  })

  const deleteProjectMutation = useMutation({
    mutationFn: (args: Parameters<typeof projectService.remove>[0]) => projectService.remove(args),
  })

  useEffect(() => {
    console.log(audios)
  }, [audios])

  function handleProjectClick(id: number) {
    if (selectedProjects.includes(id)) {
      setSelectedProjects(previous => previous.filter(selectedId => selectedId !== id))
    } else {
      setSelectedProjects(previous => [...previous, id])
    }
  }

  function handleProjectEditClick(id: number) {
    setEditProjectId(id)
    setIsProjectModalOpened(true)
  }

  async function handleProjectDeleteClick() {
    await Promise.allSettled(selectedProjects.map((id) => deleteProjectMutation.mutateAsync(id)))
    queryClient.invalidateQueries({ queryKey: ["projects"] })
    setIsProjectModalOpened(false)
    setSelectedProjects([])
  }

  function handleSubmit(values: ProjectSchema) {
    if (editProjectId) {
      updateProjectMutation.mutate([editProjectId, values])
    } else {
      newProjectMutation.mutate(values)
    }
  }

  function handleModalClose() {
    setIsProjectModalOpened(false)
    setEditProjectId(null)
  }

  if (!projects) {
    return <Loader />
  }

  const selectedCount = selectedProjects.length
  const projectToEdit = projects.find(p => p.id === editProjectId)

  return (
    <Stack>
      <Title>Your Projects</Title>
      <Text>This is where you can manage your projects. A project is like a root folder to keep your audios organized.</Text>
      <Flex gap="md">
        <Button
          leftSection={<IconFolderPlus />}
          color="green"
          onClick={() => setIsProjectModalOpened(true)}
        >
          New project
        </Button>
        <Button
          leftSection={<IconSearch />}
          onClick={() => setAudioSearchModalOpened(true)}
        >
          Search
        </Button>
        <Button
          disabled={selectedProjects.length === 0}
          leftSection={<IconTrash />}
          color="red"
          onClick={handleProjectDeleteClick}
        >
          Delete{selectedCount === 0 ? " " : ` ${selectedCount} `}projects
        </Button>
      </Flex>
      {projects.length !== 0 ? null : (
        <Text c="dimmed">
          There are no projects yet. Click on <Text span fw="bold">New project</Text> to start!
        </Text>
      )}
      <SimpleGrid cols={{ xs: 2, md: 4 }}>
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            isSelected={selectedProjects.includes(project.id)}
            onClick={handleProjectClick}
            onEditClick={handleProjectEditClick}
          />
        ))}
      </SimpleGrid>
      <Modal
        title={projectToEdit ? "Update project" : "Create project"}
        opened={isProjectModalOpened}
        onClose={handleModalClose}
      >
        <ProjectForm
          defaultValues={projectToEdit}
          isLoading={newProjectMutation.isPending || updateProjectMutation.isPending}
          onSubmit={handleSubmit}
        />
      </Modal>
      <SearchModal
        title="Search audios in all your projects by transcription"
        audios={audios ?? []}
        opened={audioSearchModalOpened}
        onClose={() => setAudioSearchModalOpened(false)}
        onSearch={setFtsSearch}
      />
    </Stack>
  )
}
