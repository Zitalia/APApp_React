import React, { useState, useEffect } from 'react';
import SearchSelect from './SearchSelect';
import DatePickerFunction from './DatePicker';
import FormDashboard from './FormDashboard';
import axios from 'axios';
import qs from 'qs';
import { isExpired, decodeToken } from "react-jwt";

let token = localStorage.getItem('token')

function Dashboard(props) {
    
    const [state, setState] = useState({
        patient: '',
        date: ''     
    });
    
    const [items,SetItems] = useState([]);
    const [title,SetTitle] = useState("");
    const [error, setError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [options, setOptions] = useState();

    useEffect(() => {
        console.log(token) 
        console.log(isExpired(token))
        console.log(decodeToken(token))
        if (isExpired(token)) {
            alert("Desolé votre session à expiré vous allez etre redirigé vers la page de login")
            localStorage.setItem('token', '')
            return window.location = '/';
        }


        var date = new Date();
        state.date = formatDate(date);
        GetSeanceByDate();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        date = date.toLocaleDateString(undefined, options)
        SetTitle("Liste des patients ayants une séance de programmée le " + date)
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
    
    
    

    function GetName() { 
        var name;
        options.forEach((item) =>{
            if(item.value == state.patient){
                name = item.name;
            }
        });
        return name;
    }

    const GetSeanceById = function () { 
        SetItems([]);
        var nomPatient = GetName()
        SetTitle("Liste des séances programmées pour " + nomPatient);
        if(state.patient !== ""){        
            axios({
            method: 'post',
            url: 'http://localhost:8000/getSeanceById',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                patient: state.patient
            }),
            })
            .then((response) => {               
                if(response.data.length !== 0){
                    var temp = []
                    response.data.forEach((value) =>{
                        var date = new Date(value.date)
                        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                        date = date.toLocaleDateString(undefined, options)                        
                        let data = {                        
                            "firstValue": date,
                            "secondValue": ""                        
                        }
                        temp.push(data)
                    })     
                    SetItems(temp);                
                }else{
                    SetItems([{                        
                        "firstValue": "Aucune séance d'enregistrée pour ce patient",
                        "secondValue": ""                        
                    }]); 
                }   
                                     
            })
            .catch((err) => {
                console.log(`error${err}`);            
            });    
        }else
        {
            SetTitle("");
            SetItems([{                        
            "firstValue": "Sélectionner un patient",
            "secondValue": ""                        
            }]);
        }
    };

    const GetSeanceByDate = function () {
        SetItems([]);
        var date = new Date(state.date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        date = date.toLocaleDateString(undefined, options);
        SetTitle("Liste des patients ayant une séance de programmée le " + date);

        if(state.date !== ""){        
            axios({
            method: 'post',
            url: 'http://localhost:8000/getSeanceByDate',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                date: state.date
            }),
            })
            .then((response) => {    
                if(response.data !== ""){
                    var temp = []
                    response.data.forEach((value) =>{
                        let data = {                        
                            "firstValue": value.first_name,
                            "secondValue": value.last_name                         
                        }
                        temp.push(data)
                    })     
                    SetItems(temp);                                                   
                }else{
                    SetItems([{                        
                        "firstValue": "Aucune scéance enregistrée pour cette date",
                        "secondValue": ""                        
                    }]);
                }                
            })
            .catch((err) => {
                console.log(`error${err}`);            
            });    
        }else{
            SetItems([{                        
                "firstValue": "Sélectionner une date",
                "secondValue": ""                        
            }]);
        }
    };

    const handleChange = (e) => {             
        state.patient = e;
        // console.log(state.patient)
    };

    const formatDate = (date) => {            
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        let mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(date);
        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);      
        
        var DateFormated = `${ye}-${mo}-${da}`;   
        
        return DateFormated;
    };

    const handleChangeDate = (e) => {     
        var date = new Date(e);
        state.date = formatDate(date);
    };
    
    const handleSubmitClick = (e) => {
        e.preventDefault();
        GetSeanceById();        
    };

    const DateSubmitClick = (e) => {
        e.preventDefault();
        GetSeanceByDate();
    };
    return (
        <div className="container justify-content">
            <div className="row mt-5">
                <div className="col-6">
                    <div className="p-3 h4" align="left">Recherche par patient</div>
                    <div className="input-group mb-3">                        
                        <SearchSelect error={error} isLoaded={isLoaded} placeholder="Sélectionner un patient" options={options} sendId={handleChange} />
                        <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleSubmitClick}>Chercher</button>
                    </div>
                </div>
                <div className="col-6">
                    <div className="row">
                        <div className="col-12 p-3 h4" align="right">Recherche par date</div>
                    </div>
                    <div className="row">
                        <div className="col-12 ">   
                            <div className="row float-right" >
                                <div >
                                    <DatePickerFunction readOnly={false} sendDate={handleChangeDate} selectedDate={new Date()}/>
                                </div>
                                <div >
                                    <button type="button" className="btn btn-outline-secondary" onClick={DateSubmitClick}>Chercher</button>
                                </div>      
                            </div>                                   
                        </div>
                    </div>
                </div>
            </div>       
            {/* {console.log(items)} */}
            <br></br>
            <h5 align='center'>{title}</h5>
            <FormDashboard Values={items}/>              
        </div>
    );
  }
  export default Dashboard;