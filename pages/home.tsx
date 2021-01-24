import "react";
import { useRouter } from "next/router"
import { Button } from "antd"
import { useEffect, useState } from "react";
import { faUser, faUsers, faSignInAlt } from '@fortawesome/free-solid-svg-icons'

import { Spacer, BigButton, Line, Loading } from "../components"
import { Color, useFormatter } from "../utils"
import { useCookies } from "react-cookie";
import { removeToken, useAuth } from "../utils/auth";

interface IHome {
  username: string
}

function Home() {

  const router = useRouter()
  const f = useFormatter()
  const auth = useAuth()
  // const setAuthUsername = useSetUsername()
  const [username, setUsername] = useState('testUser')
  const [loading, setLoading] = useState<string>('')

  useEffect(() => {
    setLoading('Authenticating')
    const token = auth()
    if (token) {
      setUsername(token.username)
      setLoading('')
    }
  }, [])

  const handleIndividualReccommendation = () => {
    router.push(`/individual/confirm`)
  }

  const handleCreateGroup = () => {
    const pin = "543123"
    router.push(`/group/${pin}`)
  }

  const handleEditPreferences = () => {
    router.push(`/preference`)
  }

  const handleLogout= () => {
    // TODO: remove user from session
    setLoading('Loggin out')
    removeToken()
    router.push(`/login`).then(_ => {
      setLoading('')
    })
  }

  const handleChangeLanguge= () => {
    // TODO: 
    const text = process.env.APP_SERVER_URL
    router.push('/home', '/home', { locale: router.locale === 'th' ? 'en' : 'th' })
  }

  return (
    <div className="container middle-flex bg-gray">
      <Loading message={loading} />
      <div style={{fontSize: '1rem', color: 'gray', display: 'flex'}}>
        {f('home_hi')}{username}
        <Button style={{marginLeft: 'auto'}} onClick={handleChangeLanguge}>{router.locale === 'th' ? 'EN' : 'ไทย'}</Button>
        <Button style={{marginLeft: '1rem'}} danger onClick={handleLogout}>{f('btn_logout')}</Button>
      </div>
      <div style={{fontSize: '3rem', fontWeight: 'bolder'}}>{f('appName')}</div>
      <Spacer />
      <Line />
      <div style={{flexGrow: 1, display: 'flex', overflow: 'scroll', marginLeft: '-1.5rem', marginRight: '-1.5rem'}}>
        <div style={{margin: 'auto', width: '100%', maxWidth: '560px', padding: '0 1.5rem'}}>
          <Spacer />
          <h3>{f('home_title_individual')}</h3>
          <BigButton onClick={handleIndividualReccommendation} title={f('home_btn_individual')} iconColor={Color.orange} bold icon={faUser} />
          <Spacer line rem={3}/>
          <h3>{f('home_title_group')}</h3>
          <div style={{display: 'flex'}}>
            <BigButton onClick={handleCreateGroup} title={f('home_btn_createGroup')} iconColor={Color.orange} bold icon={faUsers} />
            <Spacer width={24} />
            <BigButton title={f('home_btn_joinGroup')} iconColor={Color.blue} bold icon={faSignInAlt} />
          </div>
          <Spacer />
        </div>
      </div>
      <Line />
      <Spacer />

      <Button onClick={handleEditPreferences} style={{maxWidth: '560px', margin: 'auto'}}>{f('btn_editPreferences')}</Button>
      
    </div>
  )
}

export default Home