import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { Button, Dropdown, Menu } from "antd"
import { faEllipsisH, faCrown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Spacer, FixedBottomButton, CardList } from "../../components"

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
    name: 'Kraimairuu',
    isHead: false,
  },
  {
    name: 'Kraimairuu Ja',
    isHead: false,
  },
  {
    name: 'Kraimairuu Loor',
    isHead: false,
  },
  {
    name: 'Kraimairuu Eiei',
    isHead: false,
  },
  {
    name: 'Kraimairuu Hahaha',
    isHead: false,
  }
]

interface IMember {
  name: string
  isHead: boolean
}

export default function GroupConfirmation() {
  const [members, setMembers] = useState<IMember[]>(fakemembers)
  const router = useRouter()
  const { pin } = router.query

  const handleCancel = () => {
    // TODO: implement close recommendation session

    router.push("/home")
  }

  const handleShare = () => {
    // TODO: shoe share model
  }

  const handleStart = () => {
    // TODO: wait for other members

    router.push("/group/start/fakegrouprecommendationid")
  }

  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) {
    return null;
  }

  // const Map = useMemo(() => dynamic(
  //   () => import("../../components/Map/Map"), // replace '@components/map' with your component's location
  //   { 
  //     loading: () => <p>A map is loading</p>,
  //     ssr: false // This line is important. It's what prevents server-side render
  //   }
  // ), [/* list variables which should trigger a re-render here */])

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

  return (
    <div className="container group-confirmation-page">
      <div className="header">
        <Button onClick={handleCancel} className="center-button">Cancel</Button>
        <div className="pin-code-box">
          <div style={{color: 'gray'}}>Pin Code</div>
          <div className="pin-code">{pin.slice(0, 3)} {pin.slice(3, 6)}</div>
        </div>
        <Button className="center-button">Share</Button>
      </div>
      <Spacer />
      {/* <Map /> */}
      <div style={{height: '220px', lineHeight: '220px', textAlign: 'center', background: 'gray'}}>
        Will be a map
      </div>
      <Spacer rem={2}/>
      <div>
        <h2 style={{fontWeight: 'bolder'}}>Members</h2>
        {membersList}
      </div>
      <Spacer height={100} />
      
      <FixedBottomButton title="Start" onClick={handleStart}/>
    </div>
  )
}