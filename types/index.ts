export type Response <T> = {
  status: boolean
  code?: string
  message?: string
  data?: T
}

export interface Recommendation {
  _id: string
  histories: History[]
  users: string[] | User[]
  members: Member[]
  location: Point
  created_at: Date
  completed_at: Date
  rating: number
  group_pin: string
  type: string
  is_completed: boolean
  is_started: boolean
  is_active: boolean
}

export type Member = {
  _id: string
  username: string
  categories: string[]
  price_range: number
  rank: string[]
  is_head: boolean
}

export type SelectItem = {
  name: string,
  value: string | number,
}

export type CommonCetegory = {
  name_th: string
  name_en: string
  name: string
  _id: string
  order: number
}

export type Preference = {
  _id: string
  name_en: string
  order: number
}

export type AuthenticationToken = {
  token: string
  username: string
  id: string
}

export type Restaurant = {
  _id: any;
  is_active: boolean;
  has_profile: boolean;
  name: string;
  profile: {
    categories: {
      _id: any;
      is_active: boolean;
      name_th: string;
      name_en: string;
      ref_id: string;
      is_visible: boolean;
      __v?: any;
    }[];
    price_range?: number;
    rating?: number;
    likes?: number;
  };
  address: string;
  location: {
    coordinates: [number, number]; // [lon, lat]
    type: string;
  };
  open_hours?: {
    key: string;
    value: string;
  }[];
  phone_no?: string;
  cover_url?: string;
  link: string;
  dist?: {
    calculated: number;
  };
  ref: string;
  ref_id: string;
  __v?: any;
}

export type AvailableItem = {
  id: string;
  name: string;
  isSelected: boolean;
  order: number;
  image?: string
}

export type History = {
  restaurant: string
  is_love: boolean
  rating: number
  timestamp: number
}

export type Point = {
  type: string
  coordinates: [number, number]
}

export type User = {
  username: string
  password: string
  has_profile: boolean
  profile?: {
      gender: 'male' | 'female'
      birthdate: Date
      preference: {
          categories: {
              category: string
              value: number
              original_value: number
          }[]
          price_range: number
          prefer_nearby: boolean
      }
  }
  recommendation_histories: Recommendation[]
  is_active: boolean
}
