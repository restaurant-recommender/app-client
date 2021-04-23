import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { Button, Dropdown, Menu, Radio, Select, message } from "antd"
import { faEllipsisH, faCrown, faLink, faCheck, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import QRCode from "react-qr-code"

import { Spacer, CardList, FixedBottom, BottomDrawer, Box, Loading, MapSearch } from "../../components"
import { typeSelectionDefault, typeSelection, preferPriceSelection, defaultLocation, ActivityEvent } from "../../utils/constant"
import { useFormatter } from "../../utils"
import { InitializeRecommendationBody, recommendationService, trackingService, userService } from "../../services"
import { getToken, setToken, useAuth } from "../../utils/auth"
import { AuthenticationToken, Member, Preference } from "../../types"

const { Option } = Select;

function IndividualConfirmation({ disableNearby }) {

  const router = useRouter()
  const f = useFormatter()
  const auth = useAuth()

  const { lat, lon, t, price } = router.query

  const [location, setLocation] = useState<[number, number]>()
  const [type, setType] = useState<string>(typeSelectionDefault.value as string)
  const [preferPrice, setPreferPrice] = useState<number>()
  const [loading, setLoading] = useState<string>('')
  const [token, getToken] = useState<AuthenticationToken>()
  const [mapSearchVisible, setMapSearchVisible] = useState(false)
  const [mapSearchResponse, setMapSearchResponse] = useState()

  useEffect(() => {
    setLoading(f('loading_gettingLocation'))
    const authToken = auth()
    trackingService.track(ActivityEvent.INDIVIDUAL_CONFIRM_PAGE)
    setToken(authToken)
    // console.log(authToken)
    if (!("geolocation" in navigator) || disableNearby) {
      setLocation(defaultLocation)
      setLoading('')
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation([position.coords.latitude, position.coords.longitude, ])
        setLoading('')
      }, (error) => {
        trackingService.track(ActivityEvent.ERROR, error.message)
        setLocation(defaultLocation)
        message.error(f('error_gettingCurrentLocation'))
        setLoading('')
      }, {
        timeout: 10000,
      })
    }
  }, [])
  
  const handleBack = () => {
    router.push("/home")
  }

  const handleStart = () => {
    setLoading(f('loading_gettingRestaurants'))
    userService.getPreferences().then((result) => {
      const authToken = auth()
      const preferences: Preference[] = result.data
      const sortedPreferences: string[] = preferences.sort((a, b) => a.order - b.order).map((preference) => preference.name_en)
      const member: Member = {
        _id: authToken.id,
        username: authToken.username,
        categories: sortedPreferences,
        price_range: preferPrice,
        rank: null,
        is_head: false,
      }
      const body: InitializeRecommendationBody = {
        members: [member],
        location: location,
        is_group: false,
        type: type,
      }
      // console.log(body)
      recommendationService.initial(body).then((result) => {
        if (result.status) {
          const recommendation = result.data
          router.push(`/individual/start/${recommendation._id}`).then((_) => {
            setLoading('')
          })
        } else {
          alert('unkown error...')
          setLoading('')
        }
      })
    })
  }

  const handleSelectType = (value) => {
    trackingService.track(ActivityEvent.CHANGE_SHOP_TYPE)
    setType(value)
  }

  const handleSelectPricePrefer = (value) => {
    trackingService.track(ActivityEvent.CHANGE_PREFER_PRICE)
    setPreferPrice(value)
  }

  const handleChangeLocation = (newLocation) => {
    setLocation(newLocation)
    trackingService.track(ActivityEvent.CHANGE_LOCATION)
  }

  const Map = dynamic(
    () => import("../../components/Map/Map"), { 
      loading: () => (
        <div style={{height: '220px', lineHeight: '220px', textAlign: 'center', background: 'gray', marginLeft: '-1.5rem', marginRight: '-1.5rem'}}>
          Map is Loading...
        </div>
      ),
      ssr: false // This line is important. It's what prevents server-side render
  })

  return (
    <div className="container group-confirmation-page">
      <Loading message={loading} />
      <Box height="32px">
        <Button onClick={handleBack}><FontAwesomeIcon icon={faChevronLeft}/>&nbsp;&nbsp;{f('btn_back')}</Button>
        <Box marginTop="-32px" lineHeight="32px" textAlign="center" fontSize="1rem" fontWeight="bold">
          {f('confirm_title_individual')}
        </Box>
      </Box>
      <Spacer />
    
      <Map location={location} draggable onChangeLocation={handleChangeLocation}>
        <MapSearch onChangeLocation={handleChangeLocation} searchResponse={mapSearchResponse} setSearchResponse={setMapSearchResponse} visible={mapSearchVisible} setVisible={setMapSearchVisible}/>
      </Map>
      <Spacer rem={2}/>

      <h3>
        {f('confirm_cravingFor')}
      </h3>
      <Select style={{ width: "100%" }} onChange={handleSelectType} defaultValue={typeSelectionDefault.value}>
        { typeSelection.map((item) => <Option value={item.value}>{f(item.name)}</Option>) } 
      </Select>

      <Spacer rem={2}/>

      <h3>
        {f('confirm_yourPreference')}
      </h3>
      <Select allowClear style={{ width: "100%" }} onChange={handleSelectPricePrefer} placeholder={f('confirm_input_preferPrice')}>
        { preferPriceSelection.map((item) => <Option value={item.value}>{f(item.name)}</Option>) } 
      </Select>

      <Spacer />
      {/* <Button disabled style={{width: '100%'}}>{f('btn_editPreferences')}</Button> */}

      {/* {type}<br/>
      {preferPrice}<br/>
      {location}<br/> */}

      <Spacer height={100} />
      
      <FixedBottom>
          <Button onClick={handleStart} type="primary" size="large" style={{width:'300px', margin:'auto'}}>{f('btn_start')}</Button>
      </FixedBottom>
    </div>
  )
}

IndividualConfirmation.getInitialProps = async (context) => {
  return { disableNearby: context.query.defaultloc }
}

export default IndividualConfirmation