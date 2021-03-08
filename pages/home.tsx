import { Box, Loading, Spacer } from "../components";
import Image from 'next/image'
import { faChevronRight, faUsers, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormatter } from "../utils";
import { useRouter } from "next/router";
import { removeToken, useAuth } from "../utils/auth";
import { useEffect, useState } from "react";
import Modal from "antd/lib/modal/Modal";
import { Button, Input } from "antd";

const headerHeight = "56px"

export default function Home() {

  const router = useRouter()
  const f = useFormatter()
  const auth = useAuth()

  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState<string>('')
  const [inputPin, setInputPin] = useState<string>('')
  const [isJoinModal, setIsJoinModal] = useState(false)

  useEffect(() => {
    setLoading(f('loading_authenticating'))
    const token = auth()
    if (token) {
      setUsername(token.username)
      setLoading('')
    }
  }, [])


  const showJoinModal = () => {
    setIsJoinModal(true);
  };

  const handleJoinConfirm = () => {
    router.push(`/group/${inputPin}`)
    setIsJoinModal(false);
  };

  const handleCloseJoinModal = () => {
    setIsJoinModal(false);
  };

  const handleIndividualReccommendation = () => {
    router.push(`/individual/confirm`)
  }

  const handleCreateGroup = () => {
    router.push(`/group/new`)
  }

  const handleEditPreferences = () => {
    router.push(`/preference`)
  }

  const handleFavorite = () => {
    router.push(`/favorite`)
  }

  const handleJoinGroup = () => {
    showJoinModal()
  }

  const onChangeInputPin = e => {
    e.preventDefault()
    setInputPin(e.target.value)
  }
  
  const handleLogout= () => {
    // TODO: remove user from session
    setLoading(f('loading_loggingOut'))
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

  const individualButton = (
    <Box onClick={handleIndividualReccommendation} className="btn" width="100%" boxShadow="0px 4px 28px rgba(0, 0, 0, 0.1)" borderRadius="14px" display="flex" padding="0.5rem" marginBottom="2rem">
      <Box flexShrink={0} width="100px" height="96px">
        <Image src="/btn_individual.svg" alt="" width="100" height="96" />
      </Box>
      <Box flexShrink={1} flexGrow={1} margin="auto 1rem">
        <Box fontSize="18px" fontWeight="bold">{f('home_title_individual')}</Box>
        <Box fontSize="10px" color="#00000060">{f('home_desc_individual')}</Box>
      </Box>
      <FontAwesomeIcon icon={faChevronRight} style={{margin: 'auto 0.5rem auto 0', fontSize: "14px"}} />
    </Box>
  )

  const groupButton = (
    <Box background="#ffffff" borderRadius="8px" height="74px" width="100%" boxShadow="0px 4px 28px rgba(0, 0, 0, 0.1)" display="flex" marginBottom="2rem" >
      <Box onClick={handleCreateGroup} className="btn" width="calc(50% - 1px)" display="flex" borderRadius="8px 0 0 8px">
        <Box margin="auto">
          <Box textAlign="center"><FontAwesomeIcon icon={faUserPlus} style={{fontSize: '24px', color: '#FF8A00'}} /></Box>
          <Box fontWeight="bold">{f('home_btn_createGroup')}</Box>
        </Box>
      </Box>
      <Box width="2px" height="100%" background="rgba(0, 0, 0, 0.15)" />
      <Box onClick={handleJoinGroup} className="btn" width="calc(50% - 1px)" display="flex" borderRadius="0 8px 8px 0">
        <Box margin="auto">
          <Box textAlign="center"><FontAwesomeIcon icon={faUsers} style={{fontSize: '24px', color: '#1890FF'}} /></Box>
          <Box fontWeight="bold">{f('home_btn_joinGroup')}</Box>
        </Box>
      </Box>
    </Box>
  )

  const ListButton = ({ onClick, title }) => (
    <Box className="btn" onClick={onClick} width="100%" boxShadow="0px 4px 28px rgba(0, 0, 0, 0.1)" borderRadius="14px" display="flex" padding="1rem" marginBottom="1rem">
      <Box>{title}</Box>
      <FontAwesomeIcon icon={faChevronRight} style={{margin: 'auto 0.5rem auto auto', fontSize: "14px"}} />
    </Box>
  )

  const groupCard = (
    <Box height="286px" width="100%" background="linear-gradient(184.21deg, #FF5B53 25.73%, #FFA300 75.76%)" boxShadow="0px 4px 28px rgba(0, 0, 0, 0.1)" borderRadius="14px" padding="1rem" marginBottom="2rem" >
      {groupButton}
      <Box width="100%" display="flex">
        <Box width="279px" height="150px" margin="0 auto">
          <Image src="/group_card.svg" alt="" width="279" height="150" />
        </Box>
      </Box>
    </Box>
  )

  const devider = (
    <Box height="1px" width="100%" background="#00000015" marginBottom="2rem" />
  )

  return (
    <Box display="block" width="100%">
      <Loading message={loading} />
      <Box background="linear-gradient(180.12deg, #FF912C 0.1%, #FF3F49 75.73%)" height="350px" width="100%" display="flex" position="fixed" zIndex={-10}>
        <Box width="320" height="282" margin="auto auto 0 auto">
          <Image src="/home_hero.svg" alt="" width="320" height="282" />
        </Box>
      </Box>

      <Box height={headerHeight} width="100%" background="transparent" position="fixed" display="flex" zIndex={20} fontSize="14px" color="white" fontWeight="bold" lineHeight={headerHeight} justifyContent="flex-end" padding="0 2rem">
        <Box onClick={handleChangeLanguge}>{router.locale === 'th' ? 'EN' : 'ไทย'}</Box>
        <Box margin="0 1rem 0 1rem" color="#ffffff60">|</Box>
        <Box onClick={handleLogout}>{f('btn_logout')}</Box>
      </Box>
      {/* <Box height={`calc(100vh - ${headerHeight})`} width="100%" background="transparent" position="fixed" overflow="scroll" marginTop={headerHeight} zIndex={20}> */}
        <Box background="#fafafa" borderRadius="24px 24px 0 0" zIndex={10} width="100%" padding="2rem" marginTop="250px" boxShadow="0px 4px 40px rgba(0, 0, 0, 0.25)">
          <Box width="100%" maxWidth="375px" margin="0 auto">
            <Box color="#00000060" marginBottom="-0.5rem">{f('home_hi')}{username}</Box>
            <h1 style={{fontSize: '36px'}}>{f('appName')}</h1>
            {individualButton}
            {devider}
            <Box fontWeight="bold" fontSize="18px" marginBottom="0.4rem">{f('home_title_group')}</Box>
            <Box color="#00000060" marginBottom="1rem">{f('home_desc_group')}</Box>
            {groupCard}
            {devider}
            <ListButton onClick={handleFavorite} title={f('btn_favorite')} />
            <ListButton onClick={handleEditPreferences} title={f('btn_editPreferences')} />
            <ListButton onClick={() => {}} title={f('btn_about')} />
          </Box>
        </Box>
      {/* </Box> */}

      <Modal visible={isJoinModal} footer={false} onCancel={handleCloseJoinModal}>
          <h2>{f('home_title_joinGroup')}</h2>
          <p>{f('home_desc_joinGroup')}</p>
          <Input onChange={onChangeInputPin} size="large" placeholder="XXXXXX"/>
          <Spacer />
          <Box display="flex">
            <Button onClick={handleCloseJoinModal} style={{marginLeft: 'auto'}}>{f('btn_cancel')}</Button>
            <Button onClick={handleJoinConfirm} type="primary" style={{marginLeft: '1rem'}}>{f('btn_join')}</Button>
          </Box>
        </Modal>
    </Box>
  )
}