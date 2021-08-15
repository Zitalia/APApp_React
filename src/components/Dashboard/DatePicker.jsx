import React, {useState, useEffect} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DatePickerFunction(props) {
    const [selectedDate, setSelectedDate] = useState(props.selectedDate);
    
    useEffect(() => {
        if(props.data && props.readOnly){
            const datesplit = props.data.split("/");
            const string = datesplit[1] + "/" + datesplit[0] + "/" + datesplit[2]
            setSelectedDate(new Date(string))
        }else{
            setSelectedDate(selectedDate)
        }

    },[setSelectedDate,selectedDate]);

    const handleChange = (event) => {
        if (event !== "default") {
            setSelectedDate(event)
            props.sendDate(event)
        }
    }

    return (
        <div>
            <DatePicker classname="shadow p-3 mb-5 bg-white rounded" selected={selectedDate} placeholderText="Sélectionner une date" onChange={handleChange} dateFormat="dd/MM/yyyy" id="date" readOnly={props.readOnly}/>
        </div>
    );
  }
  export default DatePickerFunction;