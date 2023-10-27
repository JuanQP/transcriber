import { useEffect, useState } from "react"
import { useIsAuthenticated, useSignIn, useSignOut } from "react-auth-kit"
import { Navigate, Outlet } from "react-router-dom"
import { refreshToken } from "../services/auth"
import { useMutation } from "@tanstack/react-query"
import { Loader } from "@mantine/core"
import { FIVE_MINUTES, ONE_DAY } from "./Login"

export function Layout() {
  const signIn = useSignIn()
  const signOut = useSignOut()
  const isAuthenticated = useIsAuthenticated()
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

  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}
