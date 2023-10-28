import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack, TextInput } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
})

export type ProjectSchema = z.infer<typeof schema>

interface Props {
  defaultValues?: ProjectSchema;
  isLoading?: boolean;
  onSubmit: (values: ProjectSchema) => void;
}

export function ProjectForm({ isLoading = false, ...props }: Props) {
  const { register, handleSubmit } = useForm<ProjectSchema>({
    resolver: zodResolver(schema),
    defaultValues: props.defaultValues
  })

  function handleFormSubmit(values: ProjectSchema) {
    props.onSubmit(values)
  }

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack>
        <TextInput
          label="Project name"
          placeholder="College CompSci audios"
          {...register("name")}
        />
        <Button
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          leftSection={<IconDeviceFloppy />}
          color="green"
        >
          Save
        </Button>
      </Stack>
    </Box>
  )
}
