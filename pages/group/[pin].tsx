import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { Button, Dropdown, Menu } from "antd"
import { faEllipsisH, faCrown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Spacer, CardList, FixedBottom } from "../../components"

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

  const Map = dynamic(
    () => import("../../components/Map/Map"), { 
      loading: () => (
        <div style={{height: '220px', lineHeight: '220px', textAlign: 'center', background: 'gray', marginLeft: '-1.5rem', marginRight: '-1.5rem'}}>
          Map is Loading...
        </div>
      ),
      ssr: false // This line is important. It's what prevents server-side render
  })
  // const Map = dynamic(() => import("../../components/Map/Map"), {
  //   loading: () => <p>Loading Map...</p>,
  //   ssr: false
  // });

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
          <div className="pin-code">{pin && pin.slice(0, 3)} {pin && pin.slice(3, 6)}</div>
        </div>
        <Button className="center-button">Share</Button>
      </div>
      <Spacer />

      <Map />
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
    </div>
  )
}