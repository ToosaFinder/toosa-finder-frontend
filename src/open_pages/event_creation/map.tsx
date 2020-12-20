import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import { Coordinates } from "../../utils/interfaces";

interface MapProps {
  onMapClick?: (event) => void;
  show: boolean;
  defaultLocation: Coordinates;
  children?: any;
  style?: React.CSSProperties;
  className?: string;
  centerState?: [
    Coordinates,
    React.Dispatch<React.SetStateAction<Coordinates>>
  ];
}

export default function Map(props: MapProps): JSX.Element {
  let [center, setCenter] = useState<Coordinates>(props.defaultLocation);
  if (props.centerState) {
    [center, setCenter] = props.centerState;
  }

  return (
    props.show && (
      <div style={props.style} className={props.className}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_KEY,
          }}
          defaultCenter={props.defaultLocation}
          center={center}
          defaultZoom={16}
          onClick={props.onMapClick}
          onChildClick={(key, childProps) => {
            setCenter({ lat: childProps.lat, lng: childProps.lng });
          }}
        >
          {props.children}
        </GoogleMapReact>
      </div>
    )
  );
}
