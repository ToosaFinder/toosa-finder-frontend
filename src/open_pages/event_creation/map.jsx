import React from "react";
import {GoogleMap, Marker, withScriptjs, withGoogleMap} from "react-google-maps";

export default function Map(props){
    const CurMap = () => {
        return <GoogleMap
            defaultZoom={16}
            defaultCenter={{lat: 54.843321, lng: 83.090002}}
        >
            <Marker position={{lat: 54.843321, lng: 83.090002}}/>
        </GoogleMap>
        }


    const WrappedMap = withScriptjs(withGoogleMap(CurMap));
        return (props.show &&
            <WrappedMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
                loadingElement={<div style={{height: `100%`, width: `100%`}}/>}
                containerElement={<div style={{height: `100%`, width: `100%`, marginLeft: `25px`}}/>}
                mapElement={<div style={{height: `100%`, width: `100%`}}/>}
            />
        )

}