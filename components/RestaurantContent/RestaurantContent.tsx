import { Button, Tag } from "antd";
import { Restaurant } from "../../types";
import { Collapse } from "react-collapse"
import { faMapMarkedAlt, faTimes, faStar, faThumbsUp, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Color } from "../../utils"
import { Spacer } from ".."
import { useState } from "react";

interface IRestaurantCard {
  restaurant: Restaurant
  collapsable?: boolean
}

export const RestaurantContent = (prop: IRestaurantCard) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openGoogleMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/${latitude},${longitude}`
    window.open(url, '_blank')
  }

  const openFacebookLink = (link) => {
    window.open(link, '_blank')
  }

  const moreInformation = (
    <>
    <Spacer />
      <p style={{ fontSize: '10px', color: 'gray', marginBottom: '1rem' }}>{prop.restaurant.address}</p>

      {/* Category */}
      <div>
        {prop.restaurant.profile.categories.map(({ _id, name_en }) => <Tag key={_id} style={{ padding: '4px 12px', background: '#e5e5e5', border: 'none', marginBottom: '8px', marginRight: '8px' }}>{name_en}</Tag>)}
      </div>
      <Spacer />

      {/* Profile */}
      <div>
        <strong style={{ fontSize: '1.2rem' }}>
          {`${prop.restaurant.dist.calculated.toFixed(0)} m` ?? ''}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </strong>
        {prop.restaurant.profile.price_range !== -1 && (
          <span>
            {'฿'.repeat(prop.restaurant.profile.price_range)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        )}
        {prop.restaurant.profile.rating && (
          <span style={{ color: 'black' }}>
            <FontAwesomeIcon icon={faStar} style={{ fontSize: 14, color: 'gray' }} /> {prop.restaurant.profile.rating}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        )}
        {prop.restaurant.profile.likes && (
          <span style={{ color: 'black' }}>
            <FontAwesomeIcon icon={faThumbsUp} style={{ fontSize: 14, color: 'gray' }} /> {prop.restaurant.profile.likes}
          </span>
        )}
      </div>
    </>
  )
  return (
    <div>
      {/* Picture */}
      {prop.restaurant.cover_url && <img style={{ margin: '-24px -24px 24px -24px', width: 'calc(100% + 48px)', height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0', background: '#fe8019' }} src={prop.restaurant.cover_url} />}
      {/* Title and Address */}
      <h2 style={{ marginBottom: '0.5rem' }}><strong>{prop.restaurant.name}</strong></h2>

      {/* Link */}
      <div style={{ display: 'flex' }}>
        <Button onClick={() => { openGoogleMap(prop.restaurant.location.coordinates[1], prop.restaurant.location.coordinates[0]) }} style={{ color: Color.blue7, background: Color.blue1, borderColor: Color.blue1, marginRight: '1rem' }} icon={<FontAwesomeIcon style={{ color: Color.blue7 }} icon={faMapMarkedAlt} />}>&nbsp;&nbsp;Map</Button>
        <Button onClick={() => { openFacebookLink(prop.restaurant.link) }} style={{ color: Color.blue7, background: Color.blue1, borderColor: Color.blue1, }} icon={<FontAwesomeIcon style={{ color: Color.blue7 }} icon={faFacebookSquare} />}>&nbsp;&nbsp;Page</Button>
      </div>

      {prop.collapsable ? (
        <div>
          <Button onClick={() => {setIsOpen(!isOpen)}} size="small" style={{marginTop: '1rem', marginBottom: '-1rem', width: '100%'}} type="text" icon={<FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown}/>}></Button>
          <Collapse isOpened={isOpen}>
            {moreInformation}
          </Collapse>
        </div>
      ): moreInformation}
      
    </div>
  )
}