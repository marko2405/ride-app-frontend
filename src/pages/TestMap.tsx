import { APIProvider, Map } from "@vis.gl/react-google-maps";

export default function TestMap() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ width: "100%", height: "500px" }}>
        <Map defaultCenter={{ lat: 44.0128, lng: 20.9114 }} defaultZoom={13} />
      </div>
    </APIProvider>
  );
}
