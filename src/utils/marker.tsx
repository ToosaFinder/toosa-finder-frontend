import React from "react";
import styles from "../css/marker.module.css";
interface CoordsProp {
  lat: number;
  lng: number;
  children?: JSX.Element | string;
}
export default function Marker(props: CoordsProp): JSX.Element {
  return <div className={styles.marker}>{props.children}</div>;
}