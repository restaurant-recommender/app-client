import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { Button, Dropdown, Menu, Radio, Select } from "antd"
import { faEllipsisH, faCrown, faLink, faCheck, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import QRCode from "react-qr-code"

import { Spacer, CardList, FixedBottom, BottomDrawer, Box, Loading } from "../../components"
import { typeSelectionDefault, typeSelection, preferPriceSelection, defaultLocation } from "../../utils/constant"
import { useFormatter } from "../../utils"
import { InitializeRecommendationBody, recommendationService, userService } from "../../services"
import { getToken, setToken, useAuth } from "../../utils/auth"
import { AuthenticationToken, Member, Preference } from "../../types"

const { Option } = Select;

export default function IndividualConfirmation() {

  const router = useRouter()
  const f = useFormatter()
  const auth = useAuth()

  const { lat, lon, t, price } = router.query

  const [location, setLocation] = useState<[number, number]>()
  const [type, setType] = useState<string>(typeSelectionDefault.value as string)
  const [preferPrice, setPreferPrice] = useState<number>()
  const [loading, setLoading] = useState<string>('')
  const [token, getToken] = useState<AuthenticationToken>()

  useEffect(() => {
    setLoading('Getting current location')
    const authToken = auth()
    setToken(authToken)
    console.log(authToken)
    if (!("geolocation" in navigator)) {
      alert('Geolocation is disabled')
      setLocation(defaultLocation)
      setLoading('')
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation([position.coords.latitude, position.coords.longitude, ])
        setLoading('')
      })
    }
  }, [])
  
  const handleBack = () => {
    router.push("/home")
  }

  const handleStart = () => {
    setLoading('Getting your perfect restaurant!')
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

  const handleSelectType = (e) => {
    setType(e.target.value)
  }

  const handleSelectPricePrefer = (value) => {
    setPreferPrice(value)
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
        <Button onClick={handleBack}><FontAwesomeIcon icon={faChevronLeft}/>&nbsp;&nbsp;Back</Button>
        <Box marginTop="-32px" lineHeight="32px" textAlign="center" fontSize="1rem" fontWeight="bold">
          Individual Eating
        </Box>
      </Box>
      <Spacer />
    
      <Map location={location}/>
      <Spacer rem={2}/>

      <h3>
        Craving for...
      </h3>
      <Radio.Group onChange={handleSelectType} defaultValue={typeSelectionDefault.value} style={{width: "100%"}} buttonStyle="solid" size="large">
        { typeSelection.map((item) => <Radio.Button value={item.value}>{f(item.name)}</Radio.Button>) }
      </Radio.Group>

      <Spacer rem={2}/>

      <h3>
        Your preferences
      </h3>
      <Select allowClear style={{ width: "100%" }} onChange={handleSelectPricePrefer} placeholder="Set prefer price range">
        { preferPriceSelection.map((item) => <Option value={item.value}>{f(item.name)}</Option>) } 
      </Select>

      <Spacer />
      <Button disabled style={{width: '100%'}}>Edit Preference</Button>

      {/* {type}<br/>
      {preferPrice}<br/>
      {location}<br/> */}

      <Spacer height={100} />
      
      <FixedBottom>
          <Button onClick={handleStart} type="primary" size="large" style={{width:'300px', margin:'auto'}}>Start</Button>
      </FixedBottom>
    </div>
  )
}