import { Button, Tag } from "antd";
import { Restaurant } from "../../types";
import { RestaurantContent } from "../../components";

import "./RestaurantCard.scss"

interface IRestaurantCard {
  restaurant: Restaurant
  collapsable?: boolean
  style?: any
}

export const RestaurantCard = (prop: IRestaurantCard) => {
  return (
    <div style={prop.style} className="restaurant-card">
      <RestaurantContent collapsable={prop.collapsable} restaurant={prop.restaurant} />
    </div>
  )
}