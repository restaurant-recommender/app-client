import "react";
import { useRouter } from "next/router"
import { Button } from "antd"
import { useState } from "react";
import { faUser, faUsers, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Spacer, BigButton, Line } from "../components"
import { Color, useFormatter } from "../utils"

export default function Home() {

  const router = useRouter()
  const f = useFormatter()
  const [username, setUsername] = useState('testUser')

  const handleIndividualReccommendation = () => {
    // TODO: Init recommendation -> get token
    router.push(`/individual/start/faketoken`)
  }

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
    router.push('/home', '/home', { locale: router.locale === 'th' ? 'en' : 'th' })
  }

  return (
    <div className="container middle-flex bg-gray">
      <div style={{fontSize: '1rem', color: 'gray', display: 'flex'}}>
        {f('hi')}{username}
        <Button style={{marginLeft: 'auto'}} onClick={handleChangeLanguge}>{router.locale === 'th' ? 'EN' : 'ไทย'}</Button>
        <Button style={{marginLeft: '1rem'}} danger onClick={handleLogout}>{f('logoutButton')}</Button>
      </div>
      <div style={{fontSize: '3rem', fontWeight: 'bolder'}}>{f('appName')}</div>
      <Spacer />
      <Line />
      <div style={{flexGrow: 1, display: 'flex', overflow: 'scroll', marginLeft: '-1.5rem', marginRight: '-1.5rem'}}>
        <div style={{margin: 'auto', width: '100%', maxWidth: '560px', padding: '0 1.5rem'}}>
          <Spacer />
          <h3>{f('individualTitle')}</h3>
          <BigButton onClick={handleIndividualReccommendation} title={f('individualButtonLabel')} iconColor={Color.orange} bold icon={faUser} />
          <Spacer line rem={3}/>
          <h3>{f('groupTitle')}</h3>
          <div style={{display: 'flex'}}>
            <BigButton onClick={handleCreateGroup} title={f('createGroupLabel')} iconColor={Color.orange} bold icon={faUsers} />
            <Spacer width={24} />
            <BigButton title={f('joinGroupLabel')} iconColor={Color.blue} bold icon={faSignInAlt} />
          </div>
          <Spacer />
        </div>
      </div>
      <Line />
      <Spacer />




      <Button style={{maxWidth: '560px', margin: 'auto'}}>{f('editPreferenceLabel')}</Button>
      
    </div>
  )
}