import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/router"
import { Button } from 'antd'
import io from 'socket.io-client'
import { faSyncAlt, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { RestaurantListArea, Spacer, FixedBottomButton, Loading, Box } from "../../../components"
import { Restaurant, Recommendation, AuthenticationToken, RestaurantAvailableItem } from "../../../types"
import { recommendationService, trackingService, urls } from "../../../services"
import { useAuth } from "../../../utils/auth"
import { Color, useFormatter } from "../../../utils"
import { ActivityEvent } from "../../../utils/constant"

const getItemsFromRestaurants = (restaurants: Restaurant[]): RestaurantAvailableItem[] => restaurants.map((restaurant, index) => ({
  restaurant: restaurant,
  isSelected: false,
  order: index + 1,
  image: restaurant.cover_url,
}))

function GroupStart({ id }) {
  const [recommendation, setRecommendation] = useState<Recommendation>()
  const [loading, setLoading] = useState<string>('')
  const [items, setItems] = useState<RestaurantAvailableItem[]>()
  const [totalSelected, setTotalSelected] = useState<number>()
  const [token, setToken] = useState<AuthenticationToken>()
  const [isSubmited, setIsSubmited] = useState<boolean>(false)
  const [socket, setSocket] = useState(null)
  const auth = useAuth()
  const router = useRouter()
  const f = useFormatter()

  const finish = (recommendationId: string) => {
    trackingService.track(ActivityEvent.GROUP_END, id)
    setLoading(f('loading_finishingRecommendation'))
    router.push(`/finish/${recommendationId}`).then(_ => {
      setLoading('')
    })
  }

  const updateRecommendationAndCheckForCompleted = (recommendaitonId) => {
    recommendationService.getById(recommendaitonId).then((result) => {
      if (result.status) {
        const updatedRecommendation = result.data
        setRecommendation(updatedRecommendation)
        if (updatedRecommendation.is_completed) {
          finish(updatedRecommendation._id)
        }
      } else {
        console.log(result)
        alert('update data error!')
      }
    }) 
  }

  const setItemsCallback = useCallback((newItems) => {
    setItems(newItems)
    // console.log(newItems)
  }, [])

  const submited = () => {
    setIsSubmited(true)
  }

  useEffect(() => {
    const authToken = auth()
    trackingService.track(ActivityEvent.GROUP_RECOMMENDATION_PAGE)
    setToken(authToken)
    const socketIo = io(urls.app_server, {
      transports: ['websocket'],
    })
    setSocket(socketIo)
    
    recommendationService.getById(id).then((result) => {
      if (result.status) {
        const fetchedRecommendation = result.data
        setRecommendation(fetchedRecommendation)
        setTotalSelected(fetchedRecommendation.sugessted_restaurants.length)
        setItems(getItemsFromRestaurants(fetchedRecommendation.sugessted_restaurants))
        socketIo.emit('group-rank-join', fetchedRecommendation._id)
        socketIo.on('group-rank-update', () => {
          console.log('group rank update')
          updateRecommendationAndCheckForCompleted(fetchedRecommendation._id)
        })
        trackingService.track(ActivityEvent.GROUP_START, id)
        const memberRank = fetchedRecommendation.members.find((e) => e._id.toString() === authToken.id.toString()).rank
        if (memberRank && memberRank.length > 0) {
          submited()
          if (fetchedRecommendation.is_completed) {
            finish(fetchedRecommendation._id)
          }
        }
      } else {
        // console.log(result)
        alert(result.message)
        router.push('/home')
      }
    })
  }, [])

  const handleNext = () => {
    if (isValid()) {
      // console.log(items)
      const orderedRestaurant = items.sort((a, b) => a.order - b.order).map((item) => item.restaurant._id)
      // console.log(orderedRestaurant)
      recommendationService.updateMemberRestaurantRank(recommendation._id, token.id, { rank: orderedRestaurant }).then((result) => {
        if (result.status) {
          const updatedRecommendation = result.data
          if (socket) socket.emit('group-rank-update', recommendation._id)
          submited()
          updateRecommendationAndCheckForCompleted(recommendation._id)
          // console.log(updatedRecommendation)
        } else {
          // console.log(result)
          alert('unknown error!')
        }
      })
    }
  }

  const isValid = () => items && (items.filter((item) => item.isSelected).length) === totalSelected;

  const memberProgressText = recommendation && `${recommendation.members.filter((member) => member.rank && member.rank.length > 0).length}/${recommendation.members.length}`

  const waitingDialog = (
    <Box position="fixed" display="flex" zIndex={100} background="#000000a0" top={0} width="100%" height="100%">
      <Box display="flex" margin="auto" background="#ffffff" width="240px" height="240px" borderRadius="16px">
        <Box margin="auto">
          <Spacer />
          <Box display="flex"><FontAwesomeIcon icon={faCircleNotch} spin style={{margin: "auto", fontSize: "4rem", color: Color.orange}}/></Box>
          <Spacer />
          <Box textAlign="center" fontSize="2rem" fontWeight="bold">{memberProgressText}</Box>
          <Box>{f('group_btn_waitingForOthers')}</Box>
          {/* <Box display="flex"><Button onClick={updateRecommendationAndCheckForCompleted} style={{margin: "auto"}}><FontAwesomeIcon icon={faSyncAlt}/>&nbsp;&nbsp;{f('btn_refresh')}</Button></Box> */}
        </Box>
      </Box>
    </Box>
  ) 

  return (
    <Box width="100%">
      <div className="container">
        <Loading message={loading} />
        <Box display="flex">
          <h1>{f('group_title')}</h1>
        </Box>
        <p>{f('group_desc')}</p>
        {items && <RestaurantListArea type="drag" showRanking disabled={isSubmited} selectedCount={6} availableItems={items} selectedTitle={f('title_love')} setAvailableItemsCallback={setItemsCallback}/>}
        <Spacer height={100} />
        <FixedBottomButton disabled={!isValid() || isSubmited} title={isSubmited ? `${f('group_btn_waitingForOthers')} (${memberProgressText})` : isValid() ? f('btn_finish') : f('group_btn_requireOrdering')} onClick={handleNext}/>
      </div>
      {isSubmited && waitingDialog}
    </Box>
  )
}

GroupStart.getInitialProps = async (context) => {
    return { id: context.query.id }
  }

export default GroupStart