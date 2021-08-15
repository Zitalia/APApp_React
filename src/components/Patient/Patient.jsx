import React, {useState, useEffect } from 'react';
import CreatePatient from './CreatePatient';
import CardsPatient from './CardsPatient';
import SearchSelect from '../Dashboard/SearchSelect';
import ModifyPatient from './ModifyPatient';
import axios from "axios";
import qs from 'qs';
import { isExpired, decodeToken } from "react-jwt";
let token = localStorage.getItem('token')

function Patient() {

    const [error, setError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [options, setOptions] = useState();

    const getData = (value) => {
        setPatient(value)
        SetIsmodified(true)
    }

    useEffect(() => {
        console.log(token) 
        console.log(isExpired(token))
        console.log(decodeToken(token))
        if (isExpired(token)) {
            alert("Desolé votre session à expiré vous allez etre redirigé vers la page de login")
            localStorage.setItem('token', '')
            return window.location = '/';
        }
        axios({
            method: 'post',
            url: 'http://localhost:8000/getpatients',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then(
            (result) => {
                setIsLoaded(true);
                var temp = []
                result.data.forEach(item => {
                    temp.push({name: item.first_name + " " + item.last_name, value: item.id})
                });
                setOptions(temp);
            },            
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
        
    }, [setIsLoaded, setError])

    const formData = []
    const [patient, setPatient] = useState(false)
    const [ismodified,SetIsmodified] = useState(false)

    const getValue = (value) => {
        formData.push({
            id_value: value
        })
        axios({
            method: 'post',
            url: "http://localhost:8000/getpatientsbyid",
            data: qs.stringify(formData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
            
        })
            .then(
                (result) => {
                    setPatient(result.data)
                    SetIsmodified(true)
                }
            )
    }

    return (
        <div>
            
            <div className="d-flex justify-content-between">
                <SearchSelect error={error} isLoaded={isLoaded} placeholder="Sélectionner un patient" options={options} sendId={getValue} message="Patient non trouvé"/>
                <ModifyPatient Show={ismodified} onclose={SetIsmodified} data={patient} />
                <CreatePatient />
            </div>
            <CardsPatient getData={getData}/>
        </div>
    );
  }
  export default Patient;