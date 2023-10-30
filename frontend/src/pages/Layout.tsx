import { useEffect, useState } from "react"
import { useIsAuthenticated, useSignIn, useSignOut } from "react-auth-kit"
import { Link, Navigate, Outlet, useMatches } from "react-router-dom"
import { refreshToken } from "../services/auth"
import { useMutation } from "@tanstack/react-query"
import { AppShell, Burger, Group, Loader, NavLink, Text } from "@mantine/core"
import { FIVE_MINUTES, ONE_DAY } from "./Login"
import { useDisclosure } from "@mantine/hooks"
import { IconFolder, IconLogout } from "@tabler/icons-react"

export function Layout() {
  const signIn = useSignIn()
  const signOut = useSignOut()
  const isAuthenticated = useIsAuthenticated()
  const matches = useMatches()
  const [opened, { toggle }] = useDisclosure()
  const [waiting, setWaiting] = useState(true)

  const tryLoginMutation = useMutation({
    mutationFn: refreshToken,
    onSuccess: (response, refreshToken) => {
      signIn({
        token: response.access,
        refreshToken: refreshToken,
        tokenType: "Bearer",
        expiresIn: FIVE_MINUTES,
        refreshTokenExpireIn: ONE_DAY,
        authState: {}
      })
    },
    onError: (error) => {
      console.error(error)
      signOut()
    },
    onSettled: () => setWaiting(false)
  })

  useEffect(() => {
    const previousRefreshToken = localStorage.getItem("auth_refresh")
    if(previousRefreshToken) {
      tryLoginMutation.mutate(previousRefreshToken)
    }
  }, [])

  if(tryLoginMutation.isPending || waiting) {
    return <Loader type="dots" />
  }

  if(!isAuthenticated()) {
    return <Navigate to="/login" />
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group align="center">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text
            inline
            component={Link}
            to="/"
            fw="bold"
            variant="gradient"
            gradient={{ from: "blue", to: "grape" }}
          >
            Transcriber
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink
          component={Link}
          active={matches[1].pathname === "/" || !!matches[1].pathname.match(/^\/folders/)}
          to="/"
          label="Projects"
          leftSection={<IconFolder />}
          />
        <NavLink
          component={Link}
          to="/login"
          label="Log out"
          leftSection={<IconLogout />}
          color="dark"
          onClick={() => signOut()}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
