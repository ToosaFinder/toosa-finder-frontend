import React from "react";
import GoogleMapReact from "google-map-react";
import { Coordinates } from "../../utils/interfaces";

interface MapProps {
  onMapClick?: (event) => void;
  show: boolean;
  defaultLocation: Coordinates;
  children?: any;
  style?: React.CSSProperties;
}

export default function Map(props: MapProps): JSX.Element {
  return (
    props.show && (
      <div style={props.style}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_KEY,
          }}
          defaultCenter={props.defaultLocation}
          defaultZoom={16}
          onClick={props.onMapClick}
        >
          {props.children}
        </GoogleMapReact>
      </div>
    )
  );
}
