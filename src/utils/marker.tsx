import React from "react";
import styles from "../css/marker.module.css";
interface MarkerProps {
  id?: number;
  lat: number;
  lng: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children?: JSX.Element | string;
  hoverable?: boolean;
}
export default function Marker(props: MarkerProps): JSX.Element {
  return (
    <div
      id={props.id ? props.id.toString() : ""}
      className={`${styles.marker} ${props.hoverable ? styles.hoverable : ""}`}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}
