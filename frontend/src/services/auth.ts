import axios from "axios"
import { createRefresh } from "react-auth-kit"
import { refreshTokenCallback } from "react-auth-kit/dist/types"
import { BACKEND_URL } from "../constants"
import { LoginSchema } from "../pages/Login"

type RefreshTokenResponse = {
  access: string;
}

type LoginResponse = {
  access: string;
  refresh: string;
}

export const refreshApi = createRefresh({
  interval: 4,
  refreshApiCallback: refreshTokenApiCallback,
})

async function refreshTokenApiCallback(options: Parameters<refreshTokenCallback>[0]): ReturnType<refreshTokenCallback> {
  try {
    if(!options.refreshToken) {
      throw new Error("No refresh token given")
    }
    const response = await refreshToken(options.refreshToken)
    return {
      isSuccess: true,
      newAuthToken: response.access,
      newAuthTokenExpireIn: 5
    }
  } catch (error) {
    return {
      newAuthToken: "",
      isSuccess: false
    }
  }
}

export async function login(credentials: LoginSchema) {
  const { data } = await axios.post<LoginResponse>(`${BACKEND_URL}/token/`, credentials)
  return data
}

export async function refreshToken(refresh: string) {
  const { data } = await axios.post<RefreshTokenResponse>(`${BACKEND_URL}/token/refresh/`, { refresh })
  return data
}
