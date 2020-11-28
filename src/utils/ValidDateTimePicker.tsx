import React from "react";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import moment from "moment";


export default function ValidDateTimePicker(props): JSX.Element{

    var yesterday = moment().subtract(1, "day");
    function valid(current){
        return current.isAfter(yesterday);
    }
    return <Datetime
        onChange={props.onChangeFunc}
        isValidDate={valid}
        initialValue={new Date()}
    />
}