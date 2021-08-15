import React, { useState, createRef } from 'react';
import DatePickerFunction from '../Dashboard/DatePicker';
import { Modal, Button, Form, Row, Col, Alert, Image } from 'react-bootstrap';
import axios from 'axios';
import qs from 'qs';

function ModifyPatient(props) {
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [readOnly, setReadOnly] = useState(true)
	const handleClose = () => {
		props.onclose(false)
		setReadOnly(true)
	};

	const [alertShow, setAlertShow] = useState(false)
    const [alertColor, setAlertColor] = useState(false)
    const [alertText, setAlertText] = useState(false)

	const formData = [];

	const nameInput = createRef();
	const firstnameInput = createRef();
	const theoryInput = createRef();
	const realInput = createRef();
	

	const handleChange = () => {
		setReadOnly(!readOnly)
	}

	const handleDelete = () => {
		const formData = []
		formData.push({
			id: props.data.id
		})
		axios({
			method: 'post',
			url: 'http://localhost:8000/deletepatient',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			data: qs.stringify(formData)
		})
			.then(
				(res) => {
					if (res.status == 200) {
                        setAlertShow(true)
                        setAlertColor("success")
                        setAlertText("Le patient a bien été supprimé")
                    }else {
                        setAlertShow(true)
                        setAlertColor("danger")
                        setAlertText("Erreur, le patient n'a pas été supprimé")
                    }
					setIsLoaded(true);
					handleClose();
				}).then((error) => {
					setIsLoaded(true);
					setError(error);
				}
			)
		setReadOnly(!readOnly)
		props.onclose(false)
	}

	const handleChangeDate = (value) => {
	}

	const handleClick = () => {
		let name_value = ""
		let surname_value = ""
		let theory_value = ""
		let real_value = ""
		if (nameInput.current.value !== undefined && nameInput.current.value !== "") {
			name_value = nameInput.current.value
		} else {
			name_value = props.data.last_name
		}
		if (firstnameInput.current.value !== undefined && firstnameInput.current.value !== "") {
			surname_value = firstnameInput.current.value
		} else {
			surname_value = props.data.first_name
		}
		if (theoryInput.current.value !== "") {
			theory_value = theoryInput.current.value
		} else {
			if(props.data.theory !== null){
				theory_value = props.data.theory
			}else{
				theory_value = ""
			}
		}
		if (realInput.current.value !== undefined && realInput.current.value !== "") {
			real_value = realInput.current.value
		} else {
			if(props.data.real !== null){
				real_value = props.data.real
			}else{
				real_value = ""
			}
		}

		const birthdate = document.getElementById("date").value
        const datesplit = birthdate.split("/");
        const newbirthdate = datesplit[1] + "/" + datesplit[0] + "/" + datesplit[2]

		formData.push({
			name: surname_value,
			firstname: name_value,
			theory: theory_value,
			real: real_value,
			birthdate: newbirthdate,
			id: props.data.id
		})
		console.log(formData)
		console.log(axios({
			method: 'post',
			url: 'http://localhost:8000/updatepatient',
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
					setAlertText("Le patient a bien été modifié")
					setReadOnly(!readOnly)
					props.onclose(false)
					setIsLoaded(true);
					window.location.reload(false)
					handleClose();
				}
			}).catch((error) => {
					setAlertShow(true)
					setAlertColor("danger")
					setAlertText("Erreur, le patient n'a pas été modifié")		
					setIsLoaded(true);
					setError(error);
		}))
	}

	return (
		<>
			<Alert show={alertShow} variant={alertColor} onClose={() => setAlertShow(false)} dismissible>
                <Alert.Heading>{alertText}</Alert.Heading>
            </Alert>

			<Modal show={props.Show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>{props.data.first_name + " " + props.data.last_name}</Modal.Title>
					<Button variant="light" style={{ marginLeft: "15px" }} onClick={handleDelete} hidden={readOnly} >
						<Image src="/trash.svg"></Image>
					</Button >
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col md={{ span: 4, offset: 8 }} >
							<Button onClick={handleChange}>Modifier patient</Button>
						</Col>
					</Row>
					<Form.Label>Nom</Form.Label>
					<Form.Control type="text" placeholder={props.data.first_name} ref={nameInput} readOnly={readOnly} />
					<Form.Label>Prénom</Form.Label>
					<Form.Control type="text" placeholder={props.data.last_name} ref={firstnameInput} readOnly={readOnly} />
					<Form.Label>Seuil max de fréquence théorique</Form.Label>
					<Form.Control type="text" placeholder={props.data.theory} ref={theoryInput} readOnly={readOnly} />
					<Form.Label>Seuil max de fréquence réel</Form.Label>
					<Form.Control type="text" placeholder={props.data.real} ref={realInput} readOnly={readOnly} />
					<Form.Label>Date de naissance</Form.Label>
					<DatePickerFunction readOnly={readOnly} data={props.data.birth_date} sendDate={handleChangeDate} />
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleClick} hidden={readOnly}>
						Modifier
            		</Button>
					<Alert show={alertShow} variant={alertColor} onClose={() => setAlertShow(false)} dismissible>
                        <Alert.Heading>{alertText}</Alert.Heading>
                    </Alert>
				</Modal.Footer>
			</Modal>
		</>
	);
}
export default ModifyPatient;