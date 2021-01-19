import { Button, Tag } from "antd";
import { IRestaurant } from "../../types";
import { RestaurantContent } from "../../components";

import "./RestaurantCard.scss"

interface IRestaurantCard {
  restaurant: IRestaurant
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