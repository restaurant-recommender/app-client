import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/router"
import { Button } from 'antd'
import io from 'socket.io-client'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { RestaurantListArea, Spacer, FixedBottomButton, Loading, Box } from "../../../components"
import { Restaurant, Recommendation, AuthenticationToken, RestaurantAvailableItem } from "../../../types"
import { recommendationService, urls } from "../../../services"
import { useAuth } from "../../../utils/auth"
import { useFormatter } from "../../../utils"

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
  const auth = useAuth()
  const router = useRouter()
  const f = useFormatter()

  const socket = io(urls.app_server, {
    transports: ['websocket'],
  })

  socket.on('group-rank-update', (id) => {
    console.log('new rank update!')
    if (recommendation && id === recommendation._id) {
      console.log('rank updated!')
      updateRecommendationAndCheckForCompleted()
    }
  })

  const updateRecommendationAndCheckForCompleted = () => {
    recommendationService.getById(recommendation._id).then((result) => {
      if (result.status) {
        const updatedRecommendation = result.data
        setRecommendation(updatedRecommendation)
        if (updatedRecommendation.is_completed) {
          setLoading(f('loading_finishingRecommendation'))
          router.push(`/finish/${recommendation._id}`).then(_ => {
            setLoading('')
          })
        }
      } else {
        alert('update data error!')
      }
    }) 
  }

  const setItemsCallback = useCallback((newItems) => {
    setItems(newItems)
    console.log(newItems)
  }, [])

  useEffect(() => {
    const authToken = auth()
    setToken(authToken)
    recommendationService.getById(id).then((result) => {
      if (result.status) {
        const fetchedRecommendation = result.data
        setRecommendation(fetchedRecommendation)
        setTotalSelected(fetchedRecommendation.sugessted_restaurants.length)
        setItems(getItemsFromRestaurants(fetchedRecommendation.sugessted_restaurants))
        console.log(fetchedRecommendation)
      } else {
        console.log(result)
        alert('getting recommendation error!')
      }
    })
  }, [])

  const handleNext = () => {
    if (isValid()) {
      console.log(items)
      const orderedRestaurant = items.sort((a, b) => a.order - b.order).map((item) => item.restaurant._id)
      console.log(orderedRestaurant)
      recommendationService.updateMemberRestaurantRank(recommendation._id, token.id, { rank: orderedRestaurant }).then((result) => {
        if (result.status) {
          const updatedRecommendation = result.data
          setIsSubmited(true)
          setLoading(`${f('group_btn_waitingForOthers')} (${memberProgressText})`)
          socket.emit('group-rank-update', recommendation._id)
          console.log(updatedRecommendation)
        } else {
          console.log(result)
          alert('unknown error!')
        }
      })
    }
  }

  const isValid = () => items && (items.filter((item) => item.isSelected).length) === totalSelected;

  const memberProgressText = recommendation && `${recommendation.members.filter((member) => member.rank && member.rank.length > 0).length}/${recommendation.members.length}`

  return (
    <div className="container">
      <Loading message={loading} />
      <Box display="flex">
        <h1>{f('group_title')}</h1>
        <Button style={{margin: 'auto 0 1.2rem auto'}}><FontAwesomeIcon icon={faSyncAlt} onClick={() => { updateRecommendationAndCheckForCompleted() }}/>&nbsp;&nbsp;{f('btn_refresh')}</Button>
      </Box>
      <p>{f('group_desc')}</p>
      {recommendation && recommendation.group_pin}
      {items && <RestaurantListArea type="drag" showRanking disabled={isSubmited} selectedCount={6} availableItems={items} selectedTitle={f('title_love')} setAvailableItemsCallback={setItemsCallback}/>}
      <Spacer height={100} />
      <FixedBottomButton disabled={!isValid() || isSubmited} title={isSubmited ? `${f('group_btn_waitingForOthers')} (${memberProgressText})` : isValid() ? f('btn_finish') : f('group_btn_requireOrdering')} onClick={handleNext}/>
    </div>
  )
}

GroupStart.getInitialProps = async (context) => {
    return { id: context.query.id }
  }

export default GroupStart