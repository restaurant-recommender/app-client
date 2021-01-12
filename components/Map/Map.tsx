import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet'

import "./Map.scss"

const Map = () => {
  return (
    <MapContainer id="mapid" center={[13.736717, 100.523186]} zoom={15} scrollWheelZoom={false}>
      <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoibm9ydGgxNjAyIiwiYSI6ImNram1lY2lxeDByNmUyc25zNWIzbGFucTAifQ.ihP0UD9jJk1XoR2qYOktQg"/>
      <Marker position={[13.736717, 100.523186]} draggable={true} animate={true}>
        <Popup>Hey ! I live here</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;