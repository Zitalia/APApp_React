import React, { useState, createRef } from 'react';
import DatePickerFunction from '../Dashboard/DatePicker';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import qs from 'qs';

function CreatePatient() {
    const [alertShow, setAlertShow] = useState(false)
    const [alertColor, setAlertColor] = useState(false)
    const [alertText, setAlertText] = useState(false)
    const [show, setShow] = useState(false);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true)
        setReadOnly(false)
    };
    const formData = [];

    let nameInput = createRef();
    let firstnameInput = createRef();
    let theoryInput = createRef();
    let realInput = createRef();

    const [readOnly, setReadOnly] = useState(true)

    const handleChangeDate = (value) => {
    } 

    const handleClick = () => {
        const birthdate = document.getElementById("date").value
        const datesplit = birthdate.split("/");
        const newbirthdate = datesplit[1] + "/" + datesplit[0] + "/" + datesplit[2]
        let count = 0

        formData.push({
            name: nameInput.current.value,
            firstname: firstnameInput.current.value,
            theory: theoryInput.current.value,
            real: realInput.current.value,
            birthdate: newbirthdate
        })

        for (const [key, value] of Object.entries(formData[0])) {
            console.log(key)
            if (value === "") {
                if (key === "theory" || key === "real") {
                    formData[0][key] = 0
                } else {
                    count += 1 
                    formData[0][key] = null
                }
            }
        }
        
        if (count !== 0) {
            setAlertShow(true)
            setAlertColor("danger")
            setAlertText("Erreur, le patient n'a pas été créé")
            setIsLoaded(true);
            setError(error);
        } else {
            axios({
                method: 'post',
                url: 'http://localhost:8000/setpatient',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: qs.stringify(formData)
            })
                .then(
                    (res) => {
                        if (res.status === 200) {
                            setAlertShow(true)
                            setAlertColor("success")
                            setAlertText("Le patient a bien été créé")
                            setIsLoaded(true);
                            handleClose();
                            setShow(false)
                        }
                    }).catch((error) => {
                        setAlertShow(true)
                        setAlertColor("danger")
                        setAlertText("Erreur, le patient n'a pas été créé")
                        setIsLoaded(true);
                        setError(error);
                    }
                    )
        }
        

        
    }

    return (
        <>
            <Alert show={alertShow} variant={alertColor} onClose={() => setAlertShow(false)} dismissible>
                <Alert.Heading>{alertText}</Alert.Heading>
            </Alert>

            <Button variant="primary" onClick={handleShow}>
                Créer un patient
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Création Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control type="text" placeholder="Nom" ref={nameInput} required={false} />
                    <br />
                    <Form.Control type="text" placeholder="Prénom" ref={firstnameInput} required />
                    <br />
                    <Form.Control type="text" placeholder="Seuil max de fréquence théorique" ref={theoryInput} />
                    <br />
                    <Form.Control type="text" placeholder="Seuil max de fréquence réel" ref={realInput} />
                    <Form.Text>Date de naissance</Form.Text>
                    <DatePickerFunction readOnly={readOnly} sendDate={handleChangeDate}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClick}>
                        Créer
                    </Button>
                    <Alert show={alertShow} variant={alertColor} onClose={() => setAlertShow(false)} dismissible>
                        <Alert.Heading>{alertText}</Alert.Heading>
                    </Alert>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default CreatePatient;