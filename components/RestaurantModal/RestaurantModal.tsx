import { useState } from "react";
import { Modal, Button, Tag } from "antd";
import { IRestaurant } from "../../types";
import { faMapMarkedAlt, faTimes, faStar, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { RestaurantContent } from "../../components"

interface IRestaurantModal {
  isVisible: boolean
  restuarant: IRestaurant
  onCancelCallback: any
}

export const RestaurantModal = (prop: IRestaurantModal) => {
  const closeButton = (
    <FontAwesomeIcon style={{ width: '28px', height: '28px', marginTop: '14px', background: 'white', padding: '5px', borderRadius: '14px'}} icon={faTimes} />
  )

  return (
    <Modal centered visible={prop.isVisible} onCancel={prop.onCancelCallback} footer={null} closeIcon={closeButton}>
      {prop.isVisible && prop.restuarant && <RestaurantContent restaurant={prop.restuarant}/>}
    </Modal>
  )
}