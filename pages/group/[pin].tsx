import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { Button, Dropdown, Menu } from "antd"
import { faEllipsisH, faCrown, faLink, faCheck, faChevronLeft, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import QRCode from "react-qr-code"

import { Spacer, CardList, FixedBottom, BottomDrawer, Box } from "../../components"

const fakemembers = [
  {
    name: 'Chanchana Wicha',
    isHead: true,
  },
  {
    name: 'Irin Yooktajarong',
    isHead: false,
  },
  {
    name: 'Unchalisa Taetragool',
    isHead: false,
  },
]

interface IMember {
  name: string
  isHead: boolean
}

export default function GroupConfirmation({ hostname }) {
  const [location, setLocation] = useState<[number, number]>([13.736717, 100.523186])
  const [members, setMembers] = useState<IMember[]>(fakemembers)
  const [isShareSheetVisible, setIsShareSheetVisible] = useState<boolean>(false)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const router = useRouter()
  const { pin } = router.query

  const handleCancel = () => {
    // TODO: implement close recommendation session

    router.push("/home")
  }

  const handleShare = () => {
    setIsCopied(false)
    setIsShareSheetVisible(true)
  }

  const handleStart = () => {
    // TODO: wait for other members

    router.push("/group/start/fakegrouprecommendationid")
  }

  const handleCopyLink = () => {
    setIsCopied(true)
    navigator.clipboard.writeText(getShareLink())
  }

  /* TODO: change to correct hostname */
  const getShareLink = () => `https://kinrai.dee${router.asPath}`

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

  const membersList = (
    members.map((member) => (
      <div>
        <CardList>
          <div style={{flexGrow: 1, fontWeight: 'bold'}}>{member.name}</div>
          {member.isHead && <FontAwesomeIcon icon={faCrown} style={{margin: 'auto'}}/>}
          <Dropdown overlay={memberMenu} trigger={['click']}>
            <div style={{width: '40px', height: '40px', margin: 'auto', textAlign: 'center', display: 'flex'}}>
              <FontAwesomeIcon icon={faEllipsisH} style={{margin: 'auto'}} onClick={e => e.preventDefault()}/>
            </div>
          </Dropdown>
        </CardList>
        <Spacer />
      </div>
    ))
  )

  const pinCodeBox = (
    <Box flexGrow={1} textAlign="center">
      <Box color="gray">Pin Code</Box>
      <Box fontSize="1.5rem" fontWeight="bolder">{pin && pin.slice(0, 3)} {pin && pin.slice(3, 6)}</Box>
    </Box>
  )

  return (
    <div className="container group-confirmation-page">
      <Box lineHeight="64px" height="64px" display="flex">
        <Button onClick={handleCancel} style={{margin: "auto"}} className="center-button"><FontAwesomeIcon icon={faChevronLeft} />&nbsp;&nbsp;Back</Button>
        <Box flexGrow={1} />
        <Button onClick={handleShare} style={{margin: "auto"}} className="center-button">Share&nbsp;&nbsp;<FontAwesomeIcon icon={faExternalLinkAlt} /></Button>
      </Box>
      <Box height="64px" marginTop="-64px">
        {pinCodeBox}
      </Box>
      <Spacer />

      <Map location={location}/>
      <Spacer rem={2}/>

      <div>
        <h2 style={{fontWeight: 'bolder'}}>Members</h2>
        {membersList}
      </div>
      <Spacer height={140} />
      
      <FixedBottom style={{flexDirection: 'column', height: '140px'}}>
        <div style={{width:'300px', margin:'auto', display: 'flex', marginTop: '1.5rem', marginBottom: '1rem', justifyContent: 'space-around'}}>
        <Button style={{}}>Set Prefer Price</Button>
        <Button style={{}}>Edit Preference</Button>
        </div>
        <div style={{width:'100%', display: 'flex'}}>
          <Button onClick={handleStart} type="primary" size="large" style={{width:'300px', margin:'auto'}}>Start</Button>
        </div>
      </FixedBottom>

      <BottomDrawer height={500} visible={isShareSheetVisible} onClose={() => { setIsShareSheetVisible(false) }}>
        <Box width="100%" textAlign="center">
          {pinCodeBox}
          <Spacer rem={2} />
          <QRCode value={getShareLink()}/>
          <Spacer rem={2} />
          <Button onClick={handleCopyLink} style={{width: '256px'}}><FontAwesomeIcon icon={isCopied ? faCheck : faLink}/>&nbsp;&nbsp;{isCopied ? 'Copied' : 'Copy'} to Clipboard</Button>
        </Box>
      </BottomDrawer>
    </div>
  )
}