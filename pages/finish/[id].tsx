import { useRouter } from "next/router"
import { Button, Rate, Modal } from "antd"
import { AuthenticationToken, Recommendation, Restaurant } from "../../types"

import { Loading, RestaurantCard, Spacer, BottomDrawer, Box } from "../../components"
import { useEffect, useState } from "react"
import { recommendationService, trackingService, UpdateRatingBody } from "../../services"
import { useAuth } from "../../utils/auth"
import { useFormatter } from "../../utils"
import { ActivityEvent } from "../../utils/constant"
import { ModalFuncProps } from "antd/lib/modal"

function IndividualFinish({ id }) {
  const router = useRouter()

  const [loading, setLoading] = useState<string>('')
  const [rating, setRating] = useState<number>(0)
  const [restaurant, setRestaurant] = useState<Restaurant>()
  const [ratingDrawer, setRatingDrawer] = useState<boolean>(false)
  const [token, setToken] = useState<AuthenticationToken>()
  const [summaryDrawer, setSummaryDrawer] = useState<boolean>(false)
  const [recommendation, setRecommendation] = useState<Recommendation>()

  const [modal, contextHolder] = Modal.useModal()

  const auth = useAuth()
  const f = useFormatter()

  useEffect(() => {
    setLoading(f('loading_finalizing'))
    const authToken = auth()
    setToken(authToken)
    trackingService.isTracked(ActivityEvent.WANT_TO_USE_AGAIN).then(isTracked => {
      if (isTracked) {
        setRatingDrawer(true)
      } else {
        modal.confirm(questionModalConfig)
      }
    })
    
    recommendationService.getFinal(id).then((response) => {
      console.log(response)
      if (response.status) {
        console.log('------------------------')
        console.log(response)
        setRestaurant(response.data)
        setLoading('')
        recommendationService.getById(id).then((response) => {
          console.log(response)
          if (response.status) {
            setRecommendation(response.data)
            if(response.data.final_restaurants.length > 1) {
              trackingService.track(ActivityEvent.GROUP_SUCCESS_PAGE)
            } else {
              trackingService.track(ActivityEvent.INDIVIDUAL_SUCCESS_PAGE)
            }
          }
        })
      } else {
        alert('server error!')
      }
    })
  }, [])

  const handleHome = () => {
    router.push("/home")
  }

  const handleInputRating = value => {
    setRating(value)
  }

  const handleRate = () => {
    if (rating === 0) {
      alert('Please choose 1-5 stars')
    } else {
      const body: UpdateRatingBody = { rating }
      recommendationService.updateRating(id, token.id, body).then((_) => {
        setRatingDrawer(false)
      })
    }
  }

  const handleShowSummary = () => {
    trackingService.track(ActivityEvent.SUMMARY_CLICK)
    setSummaryDrawer(true)
  }

  const questionModalConfig: ModalFuncProps = {
    title: <strong>Thank you</strong>,
    centered: true,
    icon: null,
    content: (
      <>
        {f('survey_useAgain')}
      </>
    ),
    okText: f('survey_useAgain_yes'),
    cancelText: f('survey_useAgain_no'),
    onOk: () => {
      console.log('yes')
      trackingService.track(ActivityEvent.WANT_TO_USE_AGAIN, 'yes')
      setRatingDrawer(true)
    },
    onCancel: () => {
      console.log('no')
      trackingService.track(ActivityEvent.WANT_TO_USE_AGAIN, 'no')
      setRatingDrawer(true)
    },
  };


  // const rateDialog = (
  //   <div style={{background: '#ffffff3f', textAlign: 'center', padding: '1rem', marginTop: '1rem', marginBottom: '1rem', borderRadius: '8px'}}>
  //     <p style={{color: '#ffffff', marginBottom: '0'}}>Please rate this recommenation.</p>
  //     <Rate />
  //   </div>
  // )

  return (
    <Box width="100%" height="100%" background="#F87400">
      <div className="container middle-flex" style={{height: '100%'}}>
        <Loading message={loading} />
        <Spacer />
        <h1 style={{color: 'white', textAlign: 'center', marginBottom: '1rem'}}><strong>{f('finish_title')}</strong></h1>
        <div style={{flexGrow: 1, overflow:'scroll', display: 'flex', borderRadius: '8px'}}>
          { restaurant && <RestaurantCard collapsable style={{margin: 'auto'}} restaurant={restaurant} />}
        </div>
        <Spacer />
        {recommendation && recommendation.final_restaurants.length > 1 && <Button size="large" onClick={handleShowSummary}>{f('finish_btn_summary')}</Button>}
        <Spacer />
        <Button size="large" onClick={handleHome}>{f('btn_home')}</Button>
        <BottomDrawer height="240px" visible={ratingDrawer} onClose={() => {setRatingDrawer(false)}}>
          <Spacer />
          <Box textAlign="center">{f('finish_title_rate')}</Box>
          <Box textAlign="center"><Rate onChange={handleInputRating} /></Box>
          <Spacer rem={2}/>
          <Box textAlign="center"><Button onClick={handleRate} type="primary" size="large" style={{width: '100%'}}>{f('btn_submit')}</Button></Box>
        </BottomDrawer>
        <BottomDrawer height="calc(100% - 60px)" visible={summaryDrawer} onClose={() => { setSummaryDrawer(false) }}>
          <h3>{f('finish_btn_summary')}</h3>
          <Spacer />
          {recommendation && recommendation.final_restaurants.map((r, index) => 
            <>
              <h4 style={{marginTop: '1.5rem'}}>{f('finish_rank')} {index + 1}</h4>
              <RestaurantCard collapsable restaurant={r} style={{marginBottom: '1rem'}} />
              <Box width="100%" background="#00000040" height="2px" marginBottom="1.5rem"/>
            </>
          )}
        </BottomDrawer>
        {contextHolder}
      </div>
    </Box>
  )
}

IndividualFinish.getInitialProps = async (context) => {
  return { id: context.query.id }
}

export default IndividualFinish