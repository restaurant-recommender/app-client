import "react";
import { useRouter } from "next/router"
import { Button } from "antd"
import { useState } from "react";
import { faUser, faUsers, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Spacer, BigButton, Line } from "../components"
import { Color } from "../utils"

export default function Home() {
  const router = useRouter()
  const [username, setUsername] = useState('testUser')

  const handleCreateGroup = () => {
    const pin = "543123"
    router.push(`/group/${pin}`)
  }

  const handleLogout= () => {
    // TODO: remove user from session
    router.push(`/login`)
  }

  const handleChangeLanguge= () => {
    // TODO: 
  }

  return (
    <div className="container middle-flex">
      <div style={{fontSize: '1rem', color: 'gray', display: 'flex'}}>
        Hi, {username}
        <Button style={{marginLeft: 'auto'}} onClick={handleChangeLanguge}>TH</Button>
        <Button style={{marginLeft: '1rem'}} danger onClick={handleLogout}>Logout</Button>
      </div>
      <div style={{fontSize: '3rem', fontWeight: 'bolder'}}>Kinraidee?</div>
      <Spacer />
      <Line />
      <div style={{flexGrow: 1, display: 'flex', overflow: 'scroll', marginLeft: '-1.5rem', marginRight: '-1.5rem'}}>
        <div style={{margin: 'auto', width: '100%', maxWidth: '560px', padding: '0 1.5rem'}}>
          <Spacer />
          <h3>Individual Eating</h3>
          <BigButton title="Get Individual Recommendation" iconColor={Color.orange} bold icon={faUser} />
          <Spacer line rem={3}/>
          <h3>Group Eating</h3>
          <div style={{display: 'flex'}}>
            <BigButton onClick={handleCreateGroup} title="Create Group" iconColor={Color.orange} bold icon={faUsers} />
            <Spacer width={24} />
            <BigButton title="Join Group" iconColor={Color.blue} bold icon={faSignInAlt} />
          </div>
          <Spacer />
        </div>
      </div>
      <Line />
      <Spacer />




      <Button style={{maxWidth: '560px', margin: 'auto'}}>Edit Preference</Button>
      
    </div>
  )
}