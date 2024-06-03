import L from "leaflet";

export const redIcon = L.icon({
    iconUrl:
      "./marker-icon-2x-red.png?raw=true",
    shadowUrl:
      "./marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
  
  export const blueIcon = L.icon({
    iconUrl:
      "./marker-icon.png",
    shadowUrl:
      "./marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
  