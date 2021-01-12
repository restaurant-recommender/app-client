export type IRestaurant = {
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

export type IAvailableItem = {
  id: string;
  name: string;
  isSelected: boolean;
  order: number;
}
