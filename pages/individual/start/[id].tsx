import { Button, Modal } from "antd"
import { CSSProperties, useCallback, useEffect, useState } from "react"
import { faFrown, faGrinStars, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCookies } from "react-cookie"

import { Spacer, RestaurantCard, Box, FloatButton, Loading, RestaurantListArea, FixedBottomButton } from "../../../components"
import { Restaurant, History, RestaurantAvailableItem } from "../../../types"
import { Color, useFormatter } from "../../../utils"
import { useRouter } from "next/router"
import { ModalFuncProps } from "antd/lib/modal"
import { recommendationService, trackingService, UpdateHistoryBody } from "../../../services"
import next from "next"
import { ActivityEvent } from "../../../utils/constant"

const fadeWhite = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)'

const totalSelected = 1

const getItemsFromRestaurants = (restaurants: Restaurant[]): RestaurantAvailableItem[] => restaurants.map((restaurant, index) => ({
  restaurant: restaurant,
  isSelected: false,
  order: index + 1,
}))

function IndividualStart({ id }) {

  // const [histories, setHistories] = useState<History[]>([])
  // const [restaurants, setRestaurants] = useState<Restaurant[]>()
  const [modal, contextHolder] = Modal.useModal();
  const [loading, setLoading] = useState<string>('')
  const [items, setItems] = useState<RestaurantAvailableItem[]>()

  const router = useRouter()
  const f = useFormatter()

  // const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState<number>(0)


  // const addHistory = (restaurant: Restaurant, isLove: boolean) => {
  //   const history: History = {
  //     restaurant: restaurant._id,
  //     is_love: isLove,
  //     rating: 0,
  //     timestamp: Date.now(),
  //   }
  //   histories.push(history)
  //   setHistories(histories)
  //   console.log(histories)
  // }

  // const updateAndClearHistory = async () => {
  //   return recommendationService.updateHistory(id, { histories }).then((response) => {
  //     if (!response.status) {
  //       alert('update history error!')
  //     }
  //     setHistories([])
  //     return
  //   })
  // }

  const setRestaurantFromRecommender = (restaurants: Restaurant[]) => {
    setItems(getItemsFromRestaurants(restaurants))
  }

  const requestRecommendation = () => {
    setLoading(f('loading_gettingRestaurants'))
    recommendationService.request(id as string, 10).then((response) => {
      if (response.status) {
        setRestaurantFromRecommender(response.data)
        setLoading('')
        trackingService.track(ActivityEvent.INDIVIDUAL_START, id)
      } else {
        // console.log(response)
        setLoading('')
        alert(response.message)
        router.push('/individual/confirm')
      }
    })
  }

  useEffect(() => {
    // console.log(id)
    trackingService.track(ActivityEvent.INDIVIDUAL_RECCOMMENDATION_PAGE)
    requestRecommendation()
  }, [])
  
  // const handleSkip = (restaurant: Restaurant) => {
  //   addHistory(restaurant, false)
  //   const remainingRestaurants = restaurants.filter(r => r._id !== restaurant._id)
  //   setRestaurants(remainingRestaurants)
  //   if (remainingRestaurants.length === 0) {
  //     updateAndClearHistory().then(() => {
  //       requestRecommendation()
  //     })
  //   }
  // }

  // const handleLove = (restaurant: Restaurant) => {
  //   setLoading(f('loading_finishingRecommendation'))
  //   addHistory(restaurant, true)
  //   updateAndClearHistory().then(() => {
  //     recommendationService.complete(id).then((response) => {
  //       if (response.status) {
  //         router.push(`/finish/${id}`).then((_) => {
  //           setLoading('')
  //         })
  //       } else {
  //         alert('Completing recommendation error!')
  //         setLoading('')
  //       }
  //     })
  //   })
  // }

  // const handleHome = () => {
  //   // setCookie('user', 'testcookie')
    
  // }

  const cancelModalConfig: ModalFuncProps = {
    title: f('individual_title_goHomeModal'),
    content: (
      <>
        {f('individual_desc_goHomeModal')}
      </>
    ),
    okText: f('individual_btn_goHomeModal'),
    cancelText: f('btn_no'),
    onOk: () => {
      router.push('/home')
    },
  };

  const handleCancel = () => {
    modal.confirm(cancelModalConfig)
  }

  const setItemsCallback = useCallback((newItems) => {
    setItems(newItems)
    // console.log(newItems)
  }, [])

  const handleLoadMore = () => {
    trackingService.track(ActivityEvent.INDIVIDUAL_LOAD_MORE_CLICK, id)
    setLoading(f('loading_gettingRestaurants'))
    const histories: History[] = items.map(item => ({
      restaurant: item.restaurant._id,
      is_love: null,
      rating: null,
      timestamp: null,
    }))
    recommendationService.updateHistory(id, { histories }).then((response) => {
      if (!response.status) { alert('update history error!') }
      recommendationService.request(id as string, 10).then((response) => {
        if (response.status) {
          const newRestaurants: Restaurant[] = response.data
          const newRestaurantItems: RestaurantAvailableItem[] = newRestaurants.map((restaurant, index) => ({
            restaurant: restaurant,
            order: items.length + index + 1,
            isSelected: false,
          }))
          setItems(null)
          setItems(items.concat(newRestaurantItems))
          // console.log(newRestaurantItems)
          // console.log(items.concat(newRestaurantItems))
          setLoading('')
        } else {
          // console.log(response)
          setLoading('')
          alert(response.message)
        }
      })
    })
  }

  const handleNext = () => {
    trackingService.track(ActivityEvent.INDIVIDUAL_END, id)
    setLoading(f('loading_finishingRecommendation'))
    // console.log(items)
    const histories: History[] = items.map(item => ({
      restaurant: item.restaurant._id,
      is_love: item.isSelected,
      rating: null,
      timestamp: Date.now(),
    }))
    // console.log(histories)
    recommendationService.updateHistory(id, { histories }).then((response) => {
      if (!response.status) { alert('update history error!') }
      recommendationService.complete(id).then((response) => {
        if (response.status) {
          router.push(`/finish/${id}`).then((_) => {
            setLoading('')
          })
        } else {
          alert('Completing recommendation error!')
          setLoading('')
        }
      })
    })
  }

  const isValid = () => items && (items.filter((item) => item.isSelected).length) === totalSelected

  return (
    <div className="container">
      <Loading message={loading} />
      <Box top="-1rem" left="-1rem" position="fixed" width="100%" height="128px" background="white" zIndex={10}/>
      <Box position="fixed" display="block" justifyContent="flex-start" marginBottom="1rem" zIndex={15}>
        <Button onClick={handleCancel} style={{margin: "auto"}} className="center-button"><FontAwesomeIcon icon={faChevronLeft} />&nbsp;&nbsp;{f('btn_back')}</Button>
        <Box display="inline-block" fontSize="1.2rem" fontWeight="bold" marginLeft="1rem">Recommended</Box>
      </Box>
      <Spacer height={64} />
      {items && <RestaurantListArea fixedBox type="checkbox" selectedCount={1} availableItems={items} selectedTitle={f('title_love')} setAvailableItemsCallback={setItemsCallback}/>}
      <Spacer />
      <Box display="flex" justifyContent="space-around">
        <Button onClick={handleLoadMore}>Show More</Button>
      </Box>
      <Spacer height={100} />
      <FixedBottomButton disabled={!isValid()} title={isValid() ? f('btn_finish') : f('individual_btn_requireSelect')} onClick={handleNext}/>
      {contextHolder}
    </div>
  )
}

IndividualStart.getInitialProps = async (context) => {
  return { id: context.query.id }
}

export default IndividualStart