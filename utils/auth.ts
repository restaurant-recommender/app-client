import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import { AuthenticationToken } from "../types";
import { useFormatter } from "./locale";
import Cookies from 'js-cookie'

const TOKEN = 'token'
const USERNAME = 'username'
const ID = 'id'

export const hasToken = (): boolean => Cookies.get(USERNAME) && Cookies.get(ID)

export const getToken = (): AuthenticationToken => {
  const token = Cookies.get(TOKEN)
  const username = Cookies.get(USERNAME)
  const id = Cookies.get(ID)
  if (!token) {
    throw('auth_notSignIn')
  }
  return { token, username, id }
}

export const setToken = (token: AuthenticationToken): void => {
  Cookies.set(TOKEN, token.token)
  Cookies.set(USERNAME, token.username)
  Cookies.set(ID, token.id)
}

export const removeToken = (): void => {
  Cookies.remove(TOKEN)
  Cookies.remove(USERNAME)
  Cookies.remove(ID)
}

export const useAuth = () => {
  const f = useFormatter()
  const router = useRouter()

  return (): AuthenticationToken => {
    const token = Cookies.get(TOKEN)
    if (!token) {
      removeToken()
      alert(f('auth_notSignIn'))
      router.push('/login')
      return null
    } else {
      // console.log(`Found token in cookie: ${token}`);
      return getToken()
    }
  }
}
