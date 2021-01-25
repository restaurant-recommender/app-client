import axios, { AxiosResponse } from "axios"
import { Response, AuthenticationToken, CommonCetegory, Preference, Member, Recommendation, Restaurant, History } from "../types"
import { getToken } from "../utils/auth"

export const urls = {
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

export type InitializeRecommendationBody = {
  members: Member[]
  location: [number, number]
  is_group: boolean
  type: string
}

export type UpdateHistoryBody = {
  histories: History[]
}

export type UpdateRatingBody = {
  rating: number
}

export type JoinGroupBody = {
  member: Member
}

export type UpdateMemberPreferPrice = {
  prefer_price: Number
}

export type UpdateMemberRestaurantOrder = {
  rank: string[]
}

const getId = (): string => getToken().id
const appServerUrl = (path: string) => `${urls.app_server}/api/${path}`

export const authenticationService = {
  login: async (body: LoginBody): Promise<AxiosResponse<Response<AuthenticationToken>>> => axios.post(appServerUrl('auth/login'), body),
  register: async (body: RegisterBody): Promise<AxiosResponse<Response<AuthenticationToken>>> => axios.post(appServerUrl('auth/register'), body),
}

export const restaurantService = {
  getCommonCetegories: async (lang: string = 'en'): Promise<AxiosResponse<Response<CommonCetegory[]>>> => axios.get(appServerUrl(`categories/common?lang=${lang}`)),
}

export const userService = {
  updatePreferences: async (body: UpdatePreferencesBody): Promise<AxiosResponse<Response<null>>> => axios.post(appServerUrl(`users/${getId()}/preferences`), body),
  getPreferences: async (): Promise<Response<Preference[]>> => axios.get(appServerUrl(`users/${getId()}/preferences`)).then((response) => response.data),
}

export const recommendationService = {
  initial: async (body: InitializeRecommendationBody): Promise<Response<Recommendation>> => axios.post(appServerUrl('recommendations/init'), body).then((response) => response.data),
  request: async (id: string): Promise<Response<Restaurant[]>> => axios.get(appServerUrl(`recommendations/${id}/request`)).then((response) => response.data),
  updateHistory: async (id: string, body: UpdateHistoryBody): Promise<Response<null>> => axios.post(appServerUrl(`recommendations/${id}/history`), body).then((response) => response.data),
  updateRating: async (id: string, userId: string, body: UpdateRatingBody): Promise<Response<null>> => axios.post(appServerUrl(`recommendations/${id}/members/${userId}/rate`), body).then((response) => response.data),
  complete: async (id: string): Promise<Response<null>> => axios.post(appServerUrl(`recommendations/${id}/complete`)).then((response) => response.data),
  getFinal: async (id: string): Promise<Response<Restaurant>> => axios.get(appServerUrl(`recommendations/${id}/final`)).then((response) => response.data),
  getById: async (id: string): Promise<Response<Recommendation>> => axios.get(appServerUrl(`recommendations/${id}`)).then((response) => response.data),
  update: async (id: string, body: any): Promise<Response<Recommendation>> => axios.post(appServerUrl(`recommendations/${id}`), body).then((response) => response.data),
  updateMemberPreferPrice: async (id: string, userId: string, body: UpdateMemberPreferPrice): Promise<Response<null>> => axios.post(appServerUrl(`recommendations/${id}/members/${userId}/price`), body).then((response) => response.data),
  updateMemberRestaurantRank: async (id: string, userId: string,  body: UpdateMemberRestaurantOrder): Promise<Response<Recommendation>> => axios.post(appServerUrl(`recommendations/${id}/members/${userId}/rank`), body).then((response) => response.data),
}

export const groupService = {
  joinGroup: async (pin: string, body: JoinGroupBody): Promise<Response<Recommendation>> => axios.post(appServerUrl(`group/${pin}/join`), body).then((response) => response.data),
}