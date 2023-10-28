import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Flex, Group, Radio, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const STATUS_KEYS = [
  "PE",
  "TR",
  "FI",
] as const

const STATUSES = [
  { value: STATUS_KEYS[0], label: "Pending" },
  { value: STATUS_KEYS[1], label: "Transcribing" },
  { value: STATUS_KEYS[2], label: "Finished" },
] as const

const schema = z.object({
  search: z.string(),
  status: z
    .enum(STATUS_KEYS)
    .nullable()
})

export type AudioSearchSchema = z.infer<typeof schema>

interface Props {
  defaultValues?: AudioSearchSchema;
  isLoading?: boolean;
  onFilter: (filters: AudioSearchSchema) => void;
}

export function AudioFilters({isLoading = false, ...props}: Props) {
  const { register, control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      search: props.defaultValues?.search ?? "",
      status: props.defaultValues?.status ?? null
    }
  })

  function handleFormSubmit(filters: AudioSearchSchema) {
    props.onFilter(filters)
  }

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Flex gap="md" align="start">
        <TextInput
          label="Search file"
          {...register("search")}
        />
        <Controller
          name="status"
          control={control}
          render={({ field: { value, onChange, ...field }, formState: { errors } }) => (
            <Radio.Group
              label="Audio status"
              value={value === null ? "null" : value}
              error={errors.status?.message}
              onChange={newValue => newValue === "null" ? onChange(null) : onChange(newValue)}
              {...field}
            >
              <Group>
                <Radio value={"null"} label="All" />
                {STATUSES.map(option => (
                  <Radio key={option.value} value={option.value} label={option.label} />
                ))}
              </Group>
            </Radio.Group>
          )}
        />
        <Button
          type="submit"
          leftSection={<IconSearch />}
          variant="filled"
          style={{ alignSelf: "center" }}
          disabled={isLoading}
          loading={isLoading}
        >
          Search
        </Button>
      </Flex>
    </Box>
  )
}
