import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Group, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  fts_search: z.string().min(1)
})

export type AudioSearchFilters = z.infer<typeof schema>

interface Props {
  /**
   * Project options
   */
  onSearch: (newSearch: AudioSearchFilters) => void;
}

export function SearchForm(props: Props) {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fts_search: ""
    }
  })

  function handleFormSubmit(search: AudioSearchFilters) {
    props.onSearch(search)
  }

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Group>
        <TextInput
          leftSection={<IconSearch />}
          label="Search text"
          placeholder="Press enter to search"
          style={{ width: "100%" }}
          {...register("fts_search")}
        />
      </Group>
    </Box>
  )
}
