import { Button, Tag, message } from "antd";
import { Restaurant } from "../../types";
import { RestaurantContent } from "../../components";
import { Box } from "../Box/Box";
import { useEffect, useState } from "react";
import { Collapse } from "react-collapse"
import { Color, useFormatter } from "../../utils"
import { faMapMarkedAlt, faTimes, faStar, faThumbsUp, faChevronDown, faChevronUp, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons'
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Spacer } from "../Spacer/Spacer";
import { favoriteService } from "../../services";

// import "./RestaurantCard.scss"

const shadow = '0px 10px 30px 0px rgba(0,0,0,0.1)'

interface IRestaurantCard {
  restaurant: Restaurant
  expanded?: boolean
  style?: any
  children?: any
  expandable?: boolean
  rank?: number
}

const imageurl = "http://www.colleges-fenway.org/wp-content/uploads/2018/09/food-festival-1.jpg"

const transitionTime = '0.5s'

export const RestaurantList = (prop: IRestaurantCard) => {
  const [isDetailed, setIsDetailed] = useState<boolean>(prop.expanded)
  const [isSaved, setIsSaved] = useState<boolean>()

  const f = useFormatter()
  
  useEffect(() => {
    favoriteService.check(prop.restaurant._id).then((response) => {
      console.log(`${prop.restaurant.name}: ${response.data}`)
      setIsSaved(response.data)
    })
  }, [])

  const openGoogleMap = (e, latitude, longitude) => {
    e.stopPropagation()
    const url = `https://www.google.com/maps/search/${latitude},${longitude}`
    window.open(url, '_blank')
  }

  const openFacebookLink = (e, link) => {
    e.stopPropagation()
    window.open(link, '_blank')
  }

  const handleSave = (e) => {
    e.stopPropagation()
    if (isSaved) {
      favoriteService.remove(prop.restaurant._id).then((response) => {
        if (response.status) {
          message.success(f('favorite_removeSuccess'))
          setIsSaved(false)
        }
      })
    }
    else if (!isSaved) {
      favoriteService.add(prop.restaurant._id).then((response) => {
        if (response.status) {
          message.success(f('favorite_saveSuccess'))
          setIsSaved(true)
        }
      })
    }
  }


  // const [detailHeight, setDetailHeight] = useState<number>()

  // useEffect(() => {
  //   const detailBoxElement = document.getElementById('detail-box')
  //   if (detailBoxElement) {
  //     const height = detailBoxElement.clientHeight;
  //     detailBoxElement.remove()
  //     setDetailHeight(height)
  //     console.log(height)
  //   } else {
  //     setDetailHeight(500)
  //   }
  // }, [])

  const handleToggleExpand = () => { setIsDetailed(!isDetailed) }

  const detail = (
    <Box transition={transitionTime} position="relative" padding='1rem' opacity={isDetailed ? 1 : 0}>
      <Box display="flex" width="100%">
        <Box marginBottom="0.5rem" fontSize="18px" flexGrow={1} fontWeight="bold">{prop.restaurant.name}</Box>
        <Box zIndex={5} flexShrink={0} onClick={handleSave} width="32px" display="flex" flexDirection="column">
          <FontAwesomeIcon icon={isSaved ? faBookmark : farBookmark} style={{ fontSize: 24, color: isSaved ? Color.blue : 'gray', margin: '0 auto' }} />
          <Box margin="2px auto 0" fontSize="8px" color={isSaved ? Color.blue : "#a5a5a5"}>{isSaved ? 'Saved' : 'Save'}</Box>
        </Box>
      </Box>

      <div>
        {prop.restaurant.profile.categories.map(({ _id, name_en }) => <Tag key={_id} style={{ padding: '2px 6px', background: '#e5e5e5', border: 'none', marginBottom: '4px', marginRight: '4px' }}>{name_en}</Tag>)}
      </div>
      <Spacer rem={0.8} />

      <Box fontSize="10px" color="gray">{prop.restaurant.address}</Box>

      <Spacer rem={0.5} />

      {/* Category */}
      

      <Box display="flex">
        <Button size="small" onClick={(e) => { openGoogleMap(e, prop.restaurant.location.coordinates[1], prop.restaurant.location.coordinates[0]) }} style={{ color: Color.blue7, background: Color.blue1, borderColor: Color.blue1, marginRight: '1rem' }} icon={<FontAwesomeIcon style={{ color: Color.blue7 }} icon={faMapMarkedAlt} />}>&nbsp;&nbsp;Map</Button>
        <Button size="small" onClick={(e) => { openFacebookLink(e, prop.restaurant.link) }} style={{ color: Color.blue7, background: Color.blue1, borderColor: Color.blue1, }} icon={<FontAwesomeIcon style={{ color: Color.blue7 }} icon={faFacebookSquare} />}>&nbsp;&nbsp;Page</Button>
      </Box>

      <Spacer rem={0.5}/>
      

      {/* Profile */}
      <div>
        {'dist' in prop.restaurant && <strong style={{ fontSize: '1rem' }}>
          {`${prop.restaurant.dist.calculated.toFixed(0)} m` ?? ''}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </strong>}
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

    </Box>
  )

  return (
    <Box onClick={prop.expandable && handleToggleExpand} overflow="hidden" width='100%' background="#ffffff" borderRadius="8px" {...prop.style} boxShadow={shadow}>
      <Box maxHeight={isDetailed ? '92px' : '72px'} overflow="hidden" transition={transitionTime} display='flex' position="relative">
        <Box borderRadius={isDetailed ? '8px 8px 0 0' : '8px 0 0 8px'} transition={transitionTime} display="flex" overflow='hidden' flexShrink={0} height={isDetailed ? '96px' : '72px'} width={isDetailed ? '100%' : '72px'}>
          <img src={prop.restaurant.cover_url ?? imageurl} style={{transition: transitionTime, position: 'relative', objectFit: 'cover', minHeight: isDetailed ? '96px' : '72px', minWidth: isDetailed ? '100%' : '72px'}} />
        </Box>
        {prop.rank && <Box borderRadius='8px 0 0 8px' display="flex" transition={transitionTime} height={isDetailed ? '96px' : '72px'} width={isDetailed ? '100%' : '72px'} background={isDetailed ? '#00000000' : '#00000070'} position="absolute">
          <Box transition={transitionTime} opacity={isDetailed ? 0 : 1} width="24px" height="24px" borderRadius="50%" margin="auto" background="#ffffff" textAlign="center" fontWeight="bold" lineHeight="24px">{prop.rank}</Box>
        </Box>}
        <Box overflow="hidden" transition={transitionTime} padding={prop.children ? '0 72px 0 1rem' : '0 1rem'} margin='auto 0' flexShrink={1} opacity={isDetailed ? 0 : 1}>{prop.restaurant.name}</Box>
        <Box transition={transitionTime} width="48px" display="flex" position="absolute" right="0" height={isDetailed ? '96px' : '72px'} top="0">
          {prop.children}
        </Box>
        <Box width="24px" height="24px" position="absolute" right="9px" top="-8px">
          <FontAwesomeIcon icon={faBookmark} style={{transition: transitionTime, fontSize: 24, color: Color.blue, opacity: isSaved && !isDetailed ? 1 : 0}} />
        </Box>
      </Box>
      <Collapse isOpened={isDetailed}>
        {detail}
      </Collapse>
    </Box>
    
  )
}