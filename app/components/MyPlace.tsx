import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Custom Marker Icon Fix
const DefaultIcon = L.icon({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MyPlaceProps {
  height: string
}
const MyPlace: React.FC<MyPlaceProps> = ({height}) => {
  const position: [number, number] = [40.36150619496173, 49.83466029193451]; // San Francisco coordinates

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: height, width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={position}>
        <Popup>Diplomaroad Headquarters</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MyPlace;
