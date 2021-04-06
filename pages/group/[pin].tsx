import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { Button, Dropdown, Menu, Radio, Select } from "antd"
import { faEllipsisH, faCrown, faLink, faCheck, faChevronLeft, faExternalLinkAlt, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import QRCode from "react-qr-code"
import io from 'socket.io-client'
import { groupService, InitializeRecommendationBody, recommendationService, urls, userService } from '../../services'
import { Spacer, CardList, FixedBottom, BottomDrawer, Box, Loading } from "../../components"
import { useAuth } from "../../utils/auth"
import { AuthenticationToken, Member, Preference, Recommendation } from "../../types"
import { defaultLocation, preferPriceSelection, typeSelection, typeSelectionDefault } from "../../utils/constant"
import { useFormatter } from "../../utils"

const { Option } = Select;

function GroupConfirmation({ pin, disableNearby }) {
  const [groupPin, setGroupPin] = useState<string>(pin !== 'new' ? pin : '')
  const [loading, setLoading] = useState<string>()
  const [location, setLocation] = useState<[number, number]>()
  const [members, setMembers] = useState<Member[]>()
  const [isShareSheetVisible, setIsShareSheetVisible] = useState<boolean>(false)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [recommendation, setRecommendation] = useState<Recommendation>()
  const [token, setToken] = useState<AuthenticationToken>()
  const [type, setType] = useState<string>(typeSelectionDefault.value as string)
  const [preferPrice, setPreferPrice] = useState<number>()
  const router = useRouter()
  const auth = useAuth()
  const f = useFormatter()

  const socket = io(urls.app_server, {
    transports: ['websocket'],
  })

  socket.on('group-update', (id) => {
    if (recommendation && id === recommendation._id) {
      updateGroup();
      console.log('updated!')
    }
  })

  const updateGroup = () => {
    console.log('inside update group')
    recommendationService.getById(recommendation._id).then((result) => {
      const updatedRecommendation = result.data
      setRecommendation(updatedRecommendation)
      console.log('updated')
      console.log(updatedRecommendation)
      if (updatedRecommendation.is_started) {
        setLoading(f('loading_startingGroupRecommendation'))
        router.push(`/group/start/${updatedRecommendation._id}`).then((_) => {
          console.log('')
        })
      }
    })
  }

  const initGroup = async (location: [number, number]) => {
    setLoading(f('loading_creatingGroup'))
    return userService.getPreferences().then((result) => {
      const authToken = auth()
      setToken(authToken)
      const preferences: Preference[] = result.data
      const sortedPreferences: string[] = preferences.sort((a, b) => a.order - b.order).map((preference) => preference.name_en)
      const member: Member = {
        _id: authToken.id,
        username: authToken.username,
        categories: sortedPreferences,
        price_range: null,
        rank: [],
        is_head: true,
      }
      const body: InitializeRecommendationBody = {
        members: [member],
        location: location,
        is_group: true,
        type: 'restaurant',
      }
      console.log(body)
      return recommendationService.initial(body).then((result) => {
        if (result.status) {
          const newRecommendation = result.data
          setRecommendation(newRecommendation)
          setGroupPin(newRecommendation.group_pin)
          setMembers(newRecommendation.members)
          router.push(`/group/${newRecommendation.group_pin}`, undefined, { shallow: true })
          setLoading('')
          return newRecommendation
        } else {
          alert('unkown error... at create group')
          setLoading('')
          return null
        }
      })
    })
  }

  const createGroup = async () => {
    setLoading(f('loading_gettingLocation'))
    const authToken = auth()
    setToken(authToken)
    console.log(authToken)
    if (!("geolocation" in navigator) || disableNearby) {
      // alert(f('alert_geolocationIsDisabled'))
      setLocation(defaultLocation)
      initGroup(defaultLocation)
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation([position.coords.latitude, position.coords.longitude])
        const fetchedLoaction = [position.coords.latitude, position.coords.longitude] as [number, number]
        initGroup(fetchedLoaction)
      })
    }
  }

  const joinGroup = async (): Promise<Recommendation> => {
    setLoading(f('loading_joiningGroup'))
    const authToken = auth()
    setToken(authToken)
    return userService.getPreferences().then((result) => {
      const preferences: Preference[] = result.data
      const sortedPreferences: string[] = preferences.sort((a, b) => a.order - b.order).map((preference) => preference.name_en)
      const member: Member = {
        _id: authToken.id,
        username: authToken.username,
        categories: sortedPreferences,
        price_range: null,
        rank: null,
        is_head: false,
      }
      return groupService.joinGroup(pin, { member }).then((result) => {
        if (result.status) {
          const newRecommendation = result.data
          if (newRecommendation.is_started) {
            setLoading(f('loading_startingGroupRecommendation'))
            router.push(`/group/start/${newRecommendation._id}`).then((_) => {
              console.log('')
            })
          }
          setRecommendation(newRecommendation)
          setMembers(newRecommendation.members)
          const newLocation = [newRecommendation.location.coordinates[1], newRecommendation.location.coordinates[0]] as [number, number]
          setLocation(newLocation)
          setLoading('')
          return newRecommendation
        } else {
          alert(`${f('alert_groupNotFound')} ${pin}`)
          setLoading('')
          router.push('/home')
        }
      })
    })
  }

  useEffect(() => {
    if (pin === 'new') {
      createGroup()
    } else {
      joinGroup().then((result) => {
        console.log(result)
        // groupHasUpdate()
        if (result) {
          socket.emit('group-update', result._id)
        }
      })
    }
    // setupSocket()
  }, [])

  // const groupHasUpdate = (id) => { if (recommendation) socket.emit('group-update', recommendation._id); }

  const handleCancel = () => {
    // TODO: implement close recommendation session

    router.push("/home")
  }

  const handleShare = () => {
    setIsCopied(false)
    setIsShareSheetVisible(true)
  }

  const handleStart = () => {
    setLoading(f('loading_startingRecommendation'))
    recommendationService.request(recommendation._id, 6).then((result) => {
      if (result.status) {
        const restaurants = result.data
        recommendationService.update(recommendation._id, { recommendation: { sugessted_restaurants: restaurants, is_started: true }}).then((_) => {
          router.push(`/group/start/${recommendation._id}`)
          socket.emit('group-update', recommendation._id)
        })
      } else {
        setLoading('')
        alert(result.message)
      }
    })
  }

  const handleCopyLink = () => {
    setIsCopied(true)
    navigator.clipboard.writeText(getShareLink())
  }

  const getShareLink = () => `${process.env.NEXT_PUBLIC_APP_CLIENT_URL}${router.asPath}`

  const getMember = (): Member => recommendation && recommendation.members.find((member) => member._id.toString() === token.id.toString())

  const handleSelectType = (e) => {
    setType(e.target.value)
    recommendationService.update(recommendation._id, { recommendation: { type: e.target.value }}).then((_) => {
      console.log('updated type')
    })
  }

  const handleSelectPricePrefer = (value) => {
    setPreferPrice(value)
    recommendationService.updateMemberPreferPrice(recommendation._id, token.id, { prefer_price: value }).then((_) => {
      socket.emit('group-update', recommendation._id)
      updateGroup()
    })
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

  const memberMenu = (
    <Menu>
      <Menu.Item key="0">
        <a href="http://www.alipay.com/">Use their location</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="http://www.taobao.com/" style={{color: 'red'}}>Remove from group</a>
      </Menu.Item>
    </Menu>
  )

  const membersList = recommendation && (
    recommendation.members.map((member) => (
      <div>
        <CardList>
          <div style={{flexGrow: 1, fontWeight: 'bold'}}>{member.username}</div>
          <span style={{margin: 'auto'}}><span style={{color:'gray'}}>{'฿'.repeat(member.price_range)}</span>&nbsp;&nbsp;{member.is_head && <FontAwesomeIcon icon={faCrown}/>}</span>
          {/* <Dropdown overlay={memberMenu} trigger={['click']}>
            <div style={{width: '40px', height: '40px', margin: 'auto', textAlign: 'center', display: 'flex'}}>
              <FontAwesomeIcon icon={faEllipsisH} style={{margin: 'auto'}} onClick={e => e.preventDefault()}/>
            </div>
          </Dropdown> */}
        </CardList>
        <Spacer />
      </div>
    ))
  )

  const pinCodeBox = (
    <Box flexGrow={1} textAlign="center">
      <Box color="gray">{f('confirm_pinCode')}</Box>
      <Box fontSize="1.5rem" fontWeight="bolder">{groupPin && groupPin.slice(0, 3)} {groupPin && groupPin.slice(3, 6)}</Box>
    </Box>
  )

  return (
    <div className="container group-confirmation-page">
      <Loading message={loading} />
      <Box lineHeight="64px" height="64px" display="flex">
        <Button onClick={handleCancel} style={{margin: "auto"}} className="center-button"><FontAwesomeIcon icon={faChevronLeft} />&nbsp;&nbsp;{f('btn_back')}</Button>
        <Box flexGrow={1} />
        <Button onClick={handleShare} style={{margin: "auto"}} className="center-button">{f('btn_share')}&nbsp;&nbsp;<FontAwesomeIcon icon={faExternalLinkAlt} /></Button>
      </Box>
      <Box height="64px" marginTop="-64px">
        {pinCodeBox}
      </Box>
      <Spacer />

      <Map location={location}/>
      {/* {process.env.NODE_ENV === 'production' && <Map location={location}/>} */}
      <Spacer rem={2}/>

      {recommendation && getMember().is_head && <>
        <h3>
          {f('confirm_cravingFor')}
        </h3>
        {/* <Radio.Group onChange={handleSelectType} defaultValue={typeSelectionDefault.value} style={{width: "100%"}} buttonStyle="solid" size="large">
          { typeSelection.map((item) => <Radio.Button value={item.value}>{f(item.name)}</Radio.Button>) }
        </Radio.Group> */}
        <Select style={{ width: "100%" }} onChange={handleSelectPricePrefer} defaultValue={typeSelectionDefault.value}>
          { typeSelection.map((item) => <Option value={item.value}>{f(item.name)}</Option>) } 
        </Select>
        <Spacer />
      </>}

      <div>
        <Box display="flex">
          <h2 style={{fontWeight: 'bolder'}}>{f('confirm_title_members')}</h2>
          <Button onClick={updateGroup} style={{marginLeft: 'auto'}}><FontAwesomeIcon icon={faSyncAlt}/>&nbsp;&nbsp;{f('btn_refresh')}</Button>
        </Box>
        {members && membersList}
      </div>
      {/* {type}<br/>
      {preferPrice}<br/> */}
      <Spacer height={140} />
      
      <FixedBottom style={{flexDirection: 'column', height: '140px'}}>
        <div style={{width:'300px', margin:'auto', display: 'flex', marginTop: '1.5rem', marginBottom: '1rem', justifyContent: 'space-around'}}>
        {/* <Button style={{}}>Set Prefer Price</Button> */}
        <Select allowClear style={{ width: "100%" }} onChange={handleSelectPricePrefer} placeholder={f('confirm_input_preferPrice')}>
          { preferPriceSelection.map((item) => <Option value={item.value}>{f(item.name)}</Option>) } 
        </Select>
        {/* <Box width="0.5rem" />
        <Button disabled style={{}}>Edit Preference</Button> */}
        </div>
        <div style={{width:'100%', display: 'flex'}}>
          {recommendation && 
            <Button disabled={recommendation && getMember().is_head && recommendation.members.length > 1 ? false : true} onClick={handleStart} type="primary" size="large" style={{width:'300px', margin:'auto'}}>
              {recommendation && 
                getMember().is_head && recommendation.members.length > 1 ? f('btn_start') :
                getMember().is_head && recommendation.members.length <= 1 ? f('confirm_btn_waitForOtherMembers') :
                f('confirm_btn_waitForHost')
              }
            </Button>
          }
        </div>
      </FixedBottom>

      <BottomDrawer height="500px" visible={isShareSheetVisible} onClose={() => { setIsShareSheetVisible(false) }}>
        <Box width="100%" textAlign="center">
          {pinCodeBox}
          <Spacer rem={2} />
          <QRCode value={getShareLink()}/>
          <Spacer rem={2} />
          <Button onClick={handleCopyLink} style={{width: '256px'}}><FontAwesomeIcon icon={isCopied ? faCheck : faLink}/>&nbsp;&nbsp;{isCopied ? f('btn_copied') : f('btn_copyLink')}</Button>
        </Box>
      </BottomDrawer>
    </div>
  )
}

GroupConfirmation.getInitialProps = async (context) => {
  return { pin: context.query.pin, disableNearby: context.query.defaultloc }
}

export default GroupConfirmation