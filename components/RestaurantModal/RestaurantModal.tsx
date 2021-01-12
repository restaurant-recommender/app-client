import { useState } from "react";
import { Modal, Button, Tag } from "antd";
import { IRestaurant } from "../../types";
import { faMapMarkedAlt, faTimes, faStar, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Color } from "../../utils"
import { Spacer } from "../../components"

interface IRestaurantModal {
  isVisible: boolean
  restuarant: IRestaurant
  onCancelCallback: any
}

export const RestaurantModal = (prop: IRestaurantModal) => {

  const restaurantCard = (
    <div>
      {/* Picture */}
      <img style={{ margin: '-24px -24px 24px -24px', width: 'calc(100% + 48px)', height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} src="https://thailawyers.com/wp-content/uploads/2018/10/Open-restaurant-in-Thailand.jpg"/>
      {/* Title and Address */}
      <h2 style={{ marginBottom: '0.5rem'}}><strong>{prop.restuarant.name}</strong></h2>
      <p style={{ fontSize: '10px', color: 'gray', marginBottom: '1rem' }}>{prop.restuarant.address}</p>

      {/* Link */}
      <div style={{display: 'flex'}}>
        <Button style={{ color: Color.blue7, marginRight: '1rem' }} icon={<FontAwesomeIcon style={{ color: Color.blue7}} icon={faMapMarkedAlt}/>}>&nbsp;&nbsp;Map</Button>
        <Button style={{ color: Color.blue7 }} icon={<FontAwesomeIcon style={{ color: Color.blue7 }} icon={faFacebookSquare}/>}>&nbsp;&nbsp;Page</Button>
      </div>

      <Spacer />

      {/* Category */}
      <div>
        {prop.restuarant.profile.categories.map(({ _id, name_en }) => <Tag key={_id} style={{ padding: '4px 12px', background: '#e5e5e5', border: 'none', marginBottom: '8px', marginRight: '8px' }}>{name_en}</Tag>)}
      </div>

      <Spacer />

      {/* Profile */}
      <div>
        <strong style={{ fontSize: '1.2rem'}}>
          {`${prop.restuarant.dist.calculated.toFixed(2)} km` ?? ''}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </strong>
        {prop.restuarant.profile.price_range !== -1 && (
          <span>
            {'฿'.repeat(prop.restuarant.profile.price_range)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        )}
        {prop.restuarant.profile.rating && (
          <span style={{color: 'black'}}>
            <FontAwesomeIcon icon={faStar} style={{ fontSize: 14, color: 'gray' }} /> {prop.restuarant.profile.rating}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        )}
        {prop.restuarant.profile.likes && (
          <span style={{color: 'black'}}>
            <FontAwesomeIcon icon={faThumbsUp} style={{ fontSize: 14, color: 'gray' }} /> {prop.restuarant.profile.likes}
          </span>
        )}
      </div> 





      {/* <h2 style={{ marginBottom: '0px', marginTop: '5px' }}>{restaurants[currentRestaurant].name ?? ''}</h2>
      <p style={{ fontSize: '10px', color: 'gray', marginBottom: '0px' }}>{restaurants[currentRestaurant].address}</p> */}
      {/* <Box display="flex">
        <Button style={{ marginBottom: '20px' }} startIcon={<MapIcon />} color="secondary" onClick={() => { openGoogleMap(restaurants[currentRestaurant].location.coordinates[1], restaurants[currentRestaurant].location.coordinates[0]) }}>
          Map
        </Button>
        <Button style={{ marginBottom: '20px' }} startIcon={<FacebookIcon />} color="secondary" onClick={() => { openFacebookLink(restaurants[currentRestaurant].link) }}>
          Page
        </Button>
        <Box flexGrow="1"></Box>
        {reportButton}
      </Box>

      <div>
        {restaurants[currentRestaurant].profile.categories.map(({ _id, name_en }) => <Chip key={_id} style={{ marginBottom: '5px', marginRight: '10px' }} label={name_en} />)}
      </div>
      <div>
        <p>
          <strong>
            {`${(getDistance(restaurants[currentRestaurant])).toFixed(2)} km` ?? ''}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </strong>
          {restaurants[currentRestaurant].profile.price_range !== -1 && (
            <span>
              {'฿'.repeat(restaurants[currentRestaurant].profile.price_range)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          )}
          {restaurants[currentRestaurant].profile.rating && (
            <span>
              <StarIcon style={{ fontSize: 14 }} /> {restaurants[currentRestaurant].profile.rating}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          )}
          {restaurants[currentRestaurant].profile.likes && (
            <span>
              <ThumbUpAltIcon style={{ fontSize: 14 }} /> {restaurants[currentRestaurant].profile.likes}
            </span>
          )}
        </p>
      </div> */}
    </div>

  )

  const closeButton = (
    <FontAwesomeIcon style={{ width: '28px', height: '28px', marginTop: '14px', background: 'white', padding: '5px', borderRadius: '14px'}} icon={faTimes} />
  )

  return (
    <Modal centered visible={prop.isVisible} onCancel={prop.onCancelCallback} footer={null} closeIcon={closeButton}>
      {prop.isVisible && prop.restuarant && restaurantCard}
    </Modal>
  )
}