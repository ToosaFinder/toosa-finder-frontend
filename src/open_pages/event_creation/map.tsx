import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import Marker from "../../utils/marker";
import api from "../../utils/api";
import { ErrorBody } from "../../utils/interfaces";
import { ReverseGeocodingSuccess } from "../../utils/reverseGeocodingResponseInterface";
import parseLocation from "../../utils/parseLocation";

export default function Map(props): JSX.Element {
  const [curLat, setLat] = useState<number>(null);
  const [curLng, setLng] = useState<number>(null);

  const onMapClick = (obj) => {
    setLat(obj.lat);
    setLng(obj.lng);

    api()
      .getLocationName({ lat: obj.lat, lng: obj.lng })
      .then((res) => {
        const { response, code } = res;
        if (code === 200) {
          const location = response as ReverseGeocodingSuccess;
          props.locationSetter(parseLocation(location));
        } else {
          const { error } = response as ErrorBody;
          props.alertSetter(error, "danger");
        }
      });
    props.coordinatesSetter({ lat: obj.lat, lng: obj.lng });
  };

  return (
    props.show && (
      <div style={{ height: `100%`, width: `100%`, marginLeft: `25px` }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_KEY,
          }}
          defaultCenter={props.defaultLocation}
          defaultZoom={16}
          onClick={onMapClick}
        >
          <Marker lat={curLat} lng={curLng}>
            я
          </Marker>
        </GoogleMapReact>
      </div>
    )
  );
}
