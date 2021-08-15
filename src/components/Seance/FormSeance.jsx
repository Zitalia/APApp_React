import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import SearchSelect from '../Dashboard/SearchSelect';
import SelectSearch from 'react-select-search';
import axios from 'axios';

function FormSeance(props) {
    
    const getId = (value) => {
        console.log(value)
    }
    const getActivity = (value) => {
        console.log(value)
    }
    const getActivityGroup = (value) => {
        console.log(value)
    }

    const optionsActivityGroup = [{name: "", value:"default"}, {name: "Endurance", value:"1"}, {name: "Force", value:"2"}, {name: "Souplesse", value:"3"}]
    const optionsActivity = [{name: "", value:"default"}, {name: "Squat", value:"1"}, {name: "Pompes", value:"2"}, {name: "Abdos-Fessiers", value:"3"}]
    const [error, setError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [options, setOptions] = useState();

    const [state, setState] = useState([{
        patient: '',
        date: ''        
    }]);

    useEffect(() => {
        
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

    const handleChange = (e) => {             
        // state.patient = e;
        // console.log(state.patient)
    };
    return(
        <Container fluid>
            <Row className="justify-content-center mx-0 mt-5">
                <div style={{ border: "solid 3px", width: "80%" }}>
                    <Row className="justify-content-center my-5">
                        {/* <SearchSelect id="patient" url="http://localhost:8000/getpatients" options={[{name: "", value:"default"}]} placeholder="Sélectionner un patient" message="Patient non trouvé." sendId={getId}/> */}
                        <SearchSelect error={error} isLoaded={isLoaded} placeholder="Sélectionner un patient" options={options} sendId={getId} />
                    </Row>

                    <Row className="mx-0">
                        <Col className="col-4">
                            <Row className="mb-5 justify-content-center">
                                <SelectSearch id="activity-group" options={optionsActivityGroup} placeholder="Sélectionner un type d'activité" message="Type d'activité non trouvé." sendId={getActivityGroup}/>
                            </Row>
                            <Row className="mb-5 justify-content-center">
                                <SelectSearch id="activity" options={optionsActivity} placeholder="Sélectionner une activité" message="Activité non trouvée." sendId={getActivity}/>
                            </Row>
                            <div style={{marginBottom: "20px", marginLeft: "21%"}} >Sélectionner une durée :</div>
                            <Row className="mb-5 justify-content-center">
                                <div>
                                    <input id="min" type="number" style={{width: "50px", marginRight: "5px"}} defaultValue="1"/>
                                    min
                                    <input id="sec" type="number" style={{width: "50px", marginLeft: "10px", marginRight: "5px"}} defaultValue="45"/>
                                    sec
                                </div>
                            </Row>
                        </Col>

                        <Col className="col-4 my-auto">
                            <Row className="justify-content-center"><input type="image" aria-label="Ajouter à la séance" src="/plus_icon.png" id="addSéance" style={{ width: "50px", height: "50px", borderRadius: "50%", borderColor: "black" }} onClick={addSeance} /></Row>
                            <Row className="justify-content-center"><label htmlFor="addSéance">Ajouter à la séance</label></Row>
                        </Col>

                        <Col id="SessionBoard" className="col-4 text-center" style={{ border: "solid 1px" }}>
                            Informations Séance
                        </Col>

                    </Row>

                </div>
            </Row>
        </Container>
    );

    
}

function addSeance() {
    const min = document.getElementById("min").value;
    const sec = document.getElementById("sec").value;
    const activity = document.getElementById("activity").value;
    console.log(activity)

    var newActivity = document.getElementById("SessionBoard");
    // var newRow = React.createElement("Row");
    var content = document.createTextNode('Activité : ' + activity + 'Durée : ' + min + ":" + sec);
    // newRow.appendChild(content);
    newActivity.appendChild(content);

}

export default FormSeance;