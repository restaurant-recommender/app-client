import { Button, Modal } from "antd"
import { CSSProperties, useEffect, useState } from "react"
import { faFrown, faGrinStars, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCookies } from "react-cookie"

import { Spacer, RestaurantCard, Box, FloatButton, Loading } from "../../../components"
import { Restaurant, History } from "../../../types"
import { Color, useFormatter } from "../../../utils"
import { useRouter } from "next/router"
import { ModalFuncProps } from "antd/lib/modal"
import { recommendationService, UpdateHistoryBody } from "../../../services"
import next from "next"

const fadeWhite = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)'

function IndividualStart({ id }) {

  const [histories, setHistories] = useState<History[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>()
  const [modal, contextHolder] = Modal.useModal();
  const [loading, setLoading] = useState<string>('')

  const router = useRouter()
  const f = useFormatter()

  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState<number>(0)


  const addHistory = (isLove: boolean) => {
    const history: History = {
      restaurant: restaurants[currentRestaurantIndex]._id,
      is_love: isLove,
      rating: 0,
      timestamp: Date.now(),
    }
    histories.push(history)
    setHistories(histories)
    console.log(histories)
  }

  const updateAndClearHistory = async () => {
    return recommendationService.updateHistory(id, { histories }).then((response) => {
      if (!response.status) {
        alert('update history error!')
      }
      setHistories([])
      return
    })
  }

  const setRestaurantFromRecommender = (restaurants: Restaurant[]) => {
    setRestaurants(restaurants)
    setCurrentRestaurantIndex(0)
  }

  const requestRecommendation = () => {
    setLoading(f('loading_gettingRestaurants'))
    recommendationService.request(id as string).then((response) => {
      if (response.status) {
        setRestaurantFromRecommender(response.data)
        setLoading('')
      } else {
        console.log(response)
        setLoading('')
        alert(response.message)
      }
    })
  }

  useEffect(() => {
    // console.log(id)
    requestRecommendation()
  }, [])
  
  const handleSkip = () => {
    addHistory(false)
    const nextIndex = currentRestaurantIndex + 1
    if (nextIndex >= restaurants.length) {
      updateAndClearHistory().then(() => {
        requestRecommendation()
      })
    } else {
      setCurrentRestaurantIndex(currentRestaurantIndex + 1)
    }
  }

  const handleLove = () => {
    setLoading(f('loading_finishingRecommendation'))
    addHistory(true)
    updateAndClearHistory().then(() => {
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

  const handleHome = () => {
    // setCookie('user', 'testcookie')
  }

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

  return (
    <div className="container">
      <Loading message={loading} />
      <Box display="block" justifyContent="flex-start" marginBottom="1rem">
        <Button onClick={handleCancel} style={{margin: "auto"}} className="center-button"><FontAwesomeIcon icon={faChevronLeft} />&nbsp;&nbsp;{f('btn_back')}</Button>
        {/* <Button>Setting</Button> */}
      </Box>

      <Spacer />
      { restaurants && <div>
        <RestaurantCard style={{margin: 'auto'}} restaurant={restaurants[currentRestaurantIndex]} />
        <Box height="120px" />
        
        <Box position="fixed" bottom="0" left="0" height="120px" display="flex" width="100%" background={fadeWhite}>
          <Box margin="auto" display="flex" width="100%" justifyContent="space-around">
            <FloatButton onClick={handleSkip} type="secondary"><FontAwesomeIcon icon={faFrown}/>&nbsp;&nbsp;{f('btn_nah')}</FloatButton>
            <FloatButton onClick={handleLove} type="primary"><FontAwesomeIcon icon={faGrinStars}/>&nbsp;&nbsp;{f('btn_love')}</FloatButton>
          </Box>
        </Box>
      </div>}
      {contextHolder}
    </div>
  )
}

IndividualStart.getInitialProps = async (context) => {
  return { id: context.query.id }
}

export default IndividualStart