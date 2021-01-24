import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet'

import "./Map.scss"

interface IMap {
  location: [number, number]
}

const Map = (prop: IMap) => {
  // onMoveEnd={this.handleMoveEnd}
  const handleChangeLocation = (e) => {
    console.log(e)
  }

  // const position: [number, number] = 

  return (
    <MapContainer id="mapid" center={prop.location} zoom={15} scrollWheelZoom={false}>
      <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoibm9ydGgxNjAyIiwiYSI6ImNram1lY2lxeDByNmUyc25zNWIzbGFucTAifQ.ihP0UD9jJk1XoR2qYOktQg"/>
      <Marker position={prop.location} draggable={false} animate={true}>
        <Popup>Hey ! I live here</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map