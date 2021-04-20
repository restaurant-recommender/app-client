import { message } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet'
import { Box } from '../Box/Box';

import "./Map.scss"

interface IMap {
  location: [number, number]
  draggable?: boolean
  onChangeLocation?: (newLocation: any) => void
}

const Map = (prop: IMap) => {
  // onMoveEnd={this.handleMoveEnd}
  // const currentPosition = prop.location && {
  //   lat: prop.location[0],
  //   lng: prop.location[1],
  // }

  const [defaultPosition, setDefaultPosition] = useState(prop.location && {
    lat: prop.location[0],
    lng: prop.location[1],
  })
  const [currentPosition, setCurrentPosition] = useState(defaultPosition)
  const [isPositionChanged, setIsPositionChanged] = useState(false)

  const handleUpdateLocation = (e) => {
    prop.onChangeLocation([currentPosition.lat, currentPosition.lng])
    setDefaultPosition(currentPosition)
    setIsPositionChanged(false)
    message.success('Location has been updated')
  }

  const handleReset = () => {
    setCurrentPosition(defaultPosition)
    setIsPositionChanged(false)
  }

  // const defaultPosition = useState
  

  // const position: [number, number] = 

  function DraggableMarker() {
    // const [draggable, setDraggable] = useState(false)
    // const [position, setPosition] = useState(currentPosition)
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            setIsPositionChanged(true)
            setCurrentPosition(marker.getLatLng())
          }
        },
      }),
      [],
    )
    // const toggleDraggable = useCallback(() => {
    //   setDraggable((d) => !d)
    // }, [])
  
    return (
      <Marker
        draggable={prop.draggable}
        eventHandlers={eventHandlers}
        position={currentPosition}
        ref={markerRef}>
        <Popup minWidth={90}>
          {/* <span onClick={toggleDraggable}>
            {draggable
              ? 'Marker is draggable'
              : 'Click here to make marker draggable'}
          </span> */}
          {currentPosition.lat.toFixed(4)}, {currentPosition.lng.toFixed(4)}
        </Popup>
      </Marker>
    )
  }

  const FloatingButton = (prop: any) => {
    return (
      <Box onClick={prop.onClick} marginRight={prop.margin} color={prop.color} fontSize={14} padding="0.3rem 0.5rem" borderRadius="8px" background="white" boxShadow="0px 6px 20px 0px rgba(0,0,0,0.3)" display="inline-block">
          {prop.label}
      </Box>
    )
  }
  

  return (
    <>
      {prop.location && <MapContainer id="mapid" center={currentPosition} zoom={15} scrollWheelZoom={false} >
        <TileLayer attribution='' url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoibm9ydGgxNjAyIiwiYSI6ImNram1lY2lxeDByNmUyc25zNWIzbGFucTAifQ.ihP0UD9jJk1XoR2qYOktQg"/>
        <DraggableMarker />
        {prop.draggable && isPositionChanged && <Box position="absolute" bottom={20} right={20} zIndex={1000}>
          <FloatingButton onClick={handleReset} margin="1rem" label="Reset" color="red"/>
          <FloatingButton onClick={handleUpdateLocation} label="Update Location" color="black"/>
        </Box>}
        {prop.draggable && !isPositionChanged && <Box position="absolute" bottom={20} right={20} zIndex={1000} padding="0.2rem 0.4rem" borderRadius="8px" background="#ffffffe0">
          Drag the marker to change the location.
        </Box>}
      </MapContainer>}

    </>
  );
};

export default Map