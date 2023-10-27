import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, Center, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { IconLock, IconUser } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "../services/auth";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

export const FIVE_MINUTES = 5
export const ONE_DAY = 1440

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export type LoginSchema = z.infer<typeof schema>

export function Login() {
  const signIn = useSignIn()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: ""
    }
  })
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      signIn({
        token: response.access,
        refreshToken: response.refresh,
        tokenType: "Bearer",
        expiresIn: FIVE_MINUTES,
        refreshTokenExpireIn: ONE_DAY,
        authState: {}
      })
      navigate("/")
    }
  })

  function handleFormSubmit(credentials: LoginSchema) {
    loginMutation.mutate(credentials)
  }

  return (
    <Center h="100vh">
      <Card shadow="sm" radius="md" padding="lg" withBorder>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack gap="sm">
            <Text>Hi! 👋 Welcome to Transcriber</Text>
            <Text>Please, sign in to start transcribing your audios 🙂</Text>
            <TextInput
              leftSection={<IconUser />}
              label="Username"
              placeholder="JuanQP"
              error={errors.username?.message}
              {...register("username")}
            />
            <PasswordInput
              leftSection={<IconLock />}
              label="Password"
              placeholder="Your password..."
              error={errors.password?.message}
              {...register("password")}
            />
            <Button
              type="submit"
              disabled={!isValid || loginMutation.isPending}
              loading={loginMutation.isPending}
            >
              Login
            </Button>
          </Stack>
        </Box>
      </Card>
    </Center>
  )
}
