import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/router"
import io from 'socket.io-client'

import { DraggableArea, Spacer, FixedBottomButton, RestaurantModal, Loading } from "../../../components"
import { AvailableItem, Restaurant, Recommendation, AuthenticationToken } from "../../../types"
import { recommendationService, urls } from "../../../services"
import { useAuth } from "../../../utils/auth"

// const imageUrls = [
//     'https://scontent.fbkk2-8.fna.fbcdn.net/v/t1.0-9/35188947_1815268218539122_1972186559268519936_o.jpg?_nc_cat=102&ccb=2&_nc_sid=e3f864&_nc_ohc=A6aUwdpUZ4kAX9trVs-&_nc_ht=scontent.fbkk2-8.fna&oh=2a00a77178054c501445826b66f74342&oe=6031F71B',
//     'https://www.julietsmile.com/wp-content/uploads/2017/12/A-Ramen-The-Street-Ratchada-11.jpg',
//     'https://media-cdn.tripadvisor.com/media/photo-o/09/22/c6/5c/casa-brew-garden.jpg',
//     'https://kiji.life/eats/wp-content/uploads/2018/03/08-2.jpg',
//     'https://cdn.eatigo.com/restaurant-image/410_a7697ed8-b8a7-4c29-844f-1bc35ec628e6.jpg',
//     'https://cdn.eatigo.com/restaurant-image/410_a7697ed8-b8a7-4c29-844f-1bc35ec628e6.jpg',
// ]

const getItemsFromRestaurants = (restaurants: Restaurant[]): AvailableItem[] => restaurants.map((restaurant, index) => ({
  id: restaurant._id,
  name: restaurant.name,
  isSelected: false,
  order: index + 1,
  image: restaurant.cover_url,
}))

function GroupStart({ id }) {
  const [recommendation, setRecommendation] = useState<Recommendation>()
  const [loading, setLoading] = useState<string>('')
  // const [restaurants, setRestaurants] = useState<IRestaurant[]>(fakerestaurant)
  const [items, setItems] = useState<AvailableItem[]>()
  const [showRestaurant, setShowrestaurant] = useState<Restaurant>()
  const [isShowRestaurant, setIsShowrestaurant] = useState<boolean>(false)
  const [totalSelected, setTotalSelected] = useState<number>()
  const [token, setToken] = useState<AuthenticationToken>()
  const [isSubmited, setIsSubmited] = useState<boolean>(false)
  const auth = useAuth()
  const router = useRouter()

  const socket = io(urls.app_server)

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
          setLoading('Finishing recommendation')
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
    // console.log(id)
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
      const orderedRestaurant = items.sort((a, b) => a.order - b.order).map((item) => item.id)
      console.log(orderedRestaurant)
      recommendationService.updateMemberRestaurantRank(recommendation._id, token.id, { rank: orderedRestaurant }).then((result) => {
        if (result.status) {
          const updatedRecommendation = result.data
          setIsSubmited(true)
          socket.emit('group-rank-update', recommendation._id)
          console.log(updatedRecommendation)
        } else {
          console.log(result)
          alert('unknown error!')
        }
      })
    }
  }

  const closeModalCallback = useCallback(() => {
    setIsShowrestaurant(false)
  }, [])

  const showRestaurantModal = (id: string) => {
    console.log(id)
  }

  const showRestaurantModalCallback = useCallback((id: string) => {
    showRestaurantModal(id)
    const targetRestaurant: Restaurant = recommendation && recommendation.sugessted_restaurants.find((restaurant) => restaurant._id.toString() === id.toString())
    console.log('-----------------')
    console.log(targetRestaurant)
    setShowrestaurant(targetRestaurant)
    setIsShowrestaurant(true)
  }, [recommendation])

  const isValid = () => items && (items.filter((item) => item.isSelected).length) === totalSelected;

  const memberProgressText = recommendation && `${recommendation.members.filter((member) => member.rank && member.rank.length > 0).length}/${recommendation.members.length}`

  return (
    <div className="container">
      <Loading message={loading} />
      <h1>Restaurants</h1>
      <p>Please order given restaurants by your preferences. Drag all {totalSelected} restaurants into <strong>Love box</strong> and <strong>rank</strong> them as your wish.</p>
      {items && <DraggableArea disabled={isSubmited} hasThumnail clickOnIdCallback={showRestaurantModalCallback} availableItems={items} selectedTitle="Love" setAvailableItemsCallback={setItemsCallback}/>}
      <Spacer height={100} />
      <FixedBottomButton disabled={!isValid() || isSubmited} title={isSubmited ? `Waiting for other member (${memberProgressText})` : isValid() ? 'Finish' : 'Please order all restaurants.'} onClick={handleNext}/>
      <RestaurantModal isVisible={isShowRestaurant} restuarant={showRestaurant} onCancelCallback={closeModalCallback} />
    </div>
  )
}

GroupStart.getInitialProps = async (context) => {
    return { id: context.query.id }
  }

export default GroupStart