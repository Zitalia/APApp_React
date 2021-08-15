import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SelectSearch from 'react-select-search';
import { fuzzySearch } from 'react-select-search';
import "../../SearchSelect.css" ;

function SearchSelect(props) {    

    const [value, setValue] = useState(null); 

    const handleChange = (event) => {
        if (event !== "default") {
            setValue(event)
            props.sendId(event)
        }
    };    
    
    return (
        props.error ? (
            <div>Erreur</div>
            ) : props.isLoaded ? (
                <SelectSearch onChange={handleChange} value={value} options={props.options} search="True" placeholder={props.placeholder} filterOptions={fuzzySearch} emptyMessage={props.message} />
                ) : (
                    <div>Chargement ...</div>
                )
    );
}

export default SearchSelect;