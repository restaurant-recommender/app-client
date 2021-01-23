import axios, { AxiosResponse } from "axios"
import { Response, AuthenticationToken, CommonCetegory, Preference } from "../types"
import { getToken } from "../utils/auth"

const urls = {
  app_server: process.env.NEXT_PUBLIC_APP_SERVER_URL as string
}

export type LoginBody = {
  username: string
  password: string
}

export type RegisterBody = {
  username: string
  password: string
}

export type UpdatePreferencesBody = {
  preferences: Preference[]
}

const getId = (): string => getToken().id

export const authenticationService = {
  login: async (body: LoginBody): Promise<AxiosResponse<Response<AuthenticationToken>>> => axios.post(`${urls.app_server}/api/auth/login`, body),
  register: async (body: RegisterBody): Promise<AxiosResponse<Response<AuthenticationToken>>> => axios.post(`${urls.app_server}/api/auth/register`, body),
}

export const restaurantService = {
  getCommonCetegories: async (lang: string = 'en'): Promise<AxiosResponse<Response<CommonCetegory[]>>> => axios.get(`${urls.app_server}/api/categories/common?lang=${lang}`),
}

export const userService = {
  updatePreferences: async (body: UpdatePreferencesBody): Promise<AxiosResponse<Response<null>>> => axios.post(`${urls.app_server}/api/users/${getId()}/preferences`, body),
  getPreferences: async (): Promise<Response<Preference[]>> => axios.get(`${urls.app_server}/api/users/${getId()}/preferences`).then((response) => response.data),
}