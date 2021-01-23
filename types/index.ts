export type Response <T> = {
  status: boolean
  code?: string
  message?: string
  data?: T
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
}

export type History = {
  restaurant: string | Restaurant
  is_love: boolean
  is_skip: boolean
  rating: number
  timestamp: Date
}

export type Point = {
  type: string
  coordinates: [number, number]
}

export type Recommendation = {
  _id: string
  histories: History[]
  users: string[] | User[]
  location: Point
  created_at: Date
  completed_at: Date
  rating: number
  is_complete: boolean
  is_active: boolean
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
