import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Drawer } from 'antd'
import Search from 'antd/lib/input/Search'
import { useEffect, useState } from 'react'
import { Box } from '../../components'
import { externalService } from '../../services'
import { useFormatter } from '../../utils'
import { Spacer } from '../Spacer/Spacer'

interface MapSearchProp {
  onChangeLocation: (location: [number, number]) => void
  visible: boolean
  setVisible: any
  searchResponse: any
  setSearchResponse: any
}

export const MapSearch = (prop: MapSearchProp) => {

  const f = useFormatter()

  const handleOpen = (e) => {
    e.stopPropagation()
    prop.setVisible(true)
  }

  const handleClose = (e) => {
    e.stopPropagation()
    prop.setVisible(false)
  }

  const handleSearch = value => {
    // console.log(value)
    externalService.longdoMapSearch(value).then((response) => {
      if (response.status === 200) {
        prop.setSearchResponse(response.data)
      } else {
        throw Error('Search response error')
      }
    }).catch((error) => {
      alert(error)
    })
  }

  const handleChange = (latitude: number, longitude: number) => {
    // console.log([latitude, longitude])
    prop.onChangeLocation([latitude, longitude])
    prop.setVisible(false)
  }

  return (
    <>
      <Box onClick={handleOpen} zIndex={1500} width="40px" display="flex" height="40px" background="white" borderRadius="8px" boxShadow="0px 6px 20px 0px rgba(0,0,0,0.3)" >
        <FontAwesomeIcon icon={faSearch} style={{fontSize: '18px', margin: 'auto'}} />
      </Box>
      {prop.visible && <Box zIndex={2000} display="flex" height="100%" position="fixed" width="100%" background="white" top={0} left={0} padding="2rem" overflow="auto">
        <Box margin="0 auto" width="100%" maxWidth="800px">
          <Box display="flex">
            <h2>{f('drawer_mapSearchTitle')}</h2>
            <Box onClick={handleClose} width="32px" height="32px" display="flex" marginLeft="auto"><FontAwesomeIcon icon={faTimes} style={{fontSize: '14px', margin: 'auto'}} /></Box>
          </Box>
          <Search size="large" placeholder="location name, keywords..." onSearch={handleSearch} enterButton />
          <Spacer rem={2}/>
          {prop.searchResponse && prop.searchResponse.data.filter(e => 'lat' in e && 'lon' in e).map(place => (
            <Box onClick={() => { handleChange(place.lat, place.lon) }} key={place.id} padding='1rem 0rem' borderTop='1px solid #00000030'>
              {place.name}
            </Box>
          ))}
        </Box>
      </Box>}
    </>
  )
}