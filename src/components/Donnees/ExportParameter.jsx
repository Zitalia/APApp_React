import React, {useState, createRef, useEffect} from 'react';
import { Modal, Button, Form, Row, Col, Alert, Image } from 'react-bootstrap';
import axios from 'axios';

function ExportParameter() {
    const [show, setShow] = useState(false);
    const [Lissage_Active, setLissage_Active] = useState(true);
    
    const [yes_color, setyes_color] = useState("success");
    const [no_color, setno_color] = useState("secondary");
    const [cardioPath,SetCardioPath] = useState("");
    const [tablettePath,SettablettePath] = useState("");
    const [error, setError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

	const cardioPath_input = createRef();
	const tablettePath_input = createRef();
	const formData = [];
	const [alertShow, setAlertShow] = useState(false)
    const [alertColor, setAlertColor] = useState(false)
    const [alertText, setAlertText] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () =>  setShow(true);
    const yesLissage_Clic = () => {
      if(!Lissage_Active){
        setLissage_Active(true);
        set_btn_lissage_color();
      }
    }
    const noLissage_Clic = () => {
      if(Lissage_Active){
        setLissage_Active(false);
        set_btn_lissage_color();
      }
    }
    const set_btn_lissage_color = () =>{
      (yes_color == "success" ? setyes_color("secondary") : setyes_color("success"));
      (no_color == "success" ? setno_color("secondary") : setno_color("success"));
    }

    useEffect(() => {
      axios({
          method: 'post',
          url: "http://localhost:8000/getParamExport",
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
          }
      })
          .then(
              (result) => {
                  setIsLoaded(true);
				  SetCardioPath(result.data.path_to_cardiogramme);
				  SettablettePath(result.data.path_to_tablette);
                  setLissage_Active(result.data.Lissage_Active);
				  set_btn_lissage_color();
              },
              // Note: it's important to handle errors here
              // instead of a catch() block so that we don't swallow
              // exceptions from actual bugs in components.
              (error) => {
                  setIsLoaded(true);
                  setError(error);
              }
          )
	}, [setIsLoaded, setError])

	const ModifyParam = () =>{
		formData.push({
			BooleanLissage : true,
			cardioPath : cardioPath_input.current.value,
			tablettPath : tablettePath_input.current.value
		})
		axios({
			method: 'post',
			url: 'http://localhost:8000/updateParamExport',
			headers: {
				'Content-Type': 'application/json',
				"request-methode":"option"
			},
			data:formData
		})
		.then(
			(res) => {
				if (res.status === 200) {
					setAlertShow(true)
					setAlertColor("success")
					SetCardioPath(formData['0'].cardioPath);
					SettablettePath(formData['0'].tablettePath);
					setAlertText("Parametres Sauvegardés")
				}else {
					setAlertShow(true)
					setAlertColor("danger")
					setAlertText("Erreur, Parametres Non modifiés")
				}
				setIsLoaded(true);
				handleClose();
			}
		).then((error) => {
			setIsLoaded(true);
			setError(error);
		})
	}

    return (
        <div className="p-1" style={{height:"5em"}}>
        <Button variant="dark" onClick={handleShow}  style={{width:"10%",height:"100%","marginLeft":"90%" }}>
          Parametres
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Création Patient</Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <Form.Label>Chemin vers les fichiers de cardiogrammes</Form.Label>
                <Form.Control type="text" ref={cardioPath_input} placeholder="Chemin vers le dossier de cardiogrammes" defaultValue={cardioPath} required={true}/>
                <Form.Label>Chemin vers le dossier tablette</Form.Label>
                <Form.Control type="text" ref={tablettePath_input} placeholder="Chemin vers le dossier de la tablette" defaultValue={tablettePath} required={true}/> 
				<Form.Group className="mt-3">
                <Button variant={yes_color} onClick={yesLissage_Clic}>Oui</Button>{' '} 
                <Button variant={no_color} onClick={noLissage_Clic}>Non</Button>{' '}
				<Form.Label>Lissage des courbes Activé</Form.Label>{' '}
				</Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={ModifyParam}>
              Validé
            </Button>
          </Modal.Footer>
        </Modal>
        </div>
    );
  }
  export default ExportParameter;