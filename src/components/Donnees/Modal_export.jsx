import React, { useState, createRef, useEffect } from 'react';
import { Modal, Button, Form, Alert, Col, Row, Image } from 'react-bootstrap';
import axios from 'axios';
import * as XLSX from 'xlsx';
import qs from 'qs';

function Modal_Export() {

  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [Lissage_Active, setLissage_Active] = useState(true);
  const [cardioPath, SetCardioPath] = useState("");
  const [tablettePath, SettablettePath] = useState("");
  const [cardioFiles, SetCardioFiles] = useState([]);
  const [tabletteFiles, SetTabletteFiles] = useState([]);
  const [jsonTablette, SetJsonTablette] = useState({});
  const [disabledButton, SetdisabledButton] = useState(true);

  const cardioFilePickUp = createRef();
  const TabletteFilePickUp = createRef();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const getData = (wb) => {
    const wsname = wb.SheetNames[0]
    const ws = wb.Sheets[wsname]
    const data = XLSX.utils.sheet_to_json(ws)
    const wsHr = wb.Sheets[wb.SheetNames[3]]
    const dataHr = XLSX.utils.sheet_to_json(wsHr)
    const birthdate = modifyDate(data)
    const age = getAge(birthdate)
    const newData = returnData(data, birthdate, age, dataHr)
    return newData
  }

  const returnData = (data, birthdate, age, dataHr) => {
    const HR = []
    const time = []
    for (let i = 0; i < dataHr.length; i++) {
      HR.push(dataHr[i]['HR'])
      time.push(dataHr[i]['training time (min:sec)'])
    }
    const datareturn = {
      nom: data['0'].Prénom,
      prenom: data['0'].Nom,
      nom_complet: data['0']['nom complet'],
      date_naissance: birthdate,
      age: age,
      time: time,
      HR: HR
    }
    return datareturn

  }


  const getAge = (birthdate) => {

    const newbirthdate = new Date(birthdate)
    const today = new Date()
    let age = today.getFullYear() - newbirthdate.getFullYear()
    const m = today.getMonth() - newbirthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < newbirthdate.getDate())) {
      age--;
    }

    return age
  }


  const modifyDate = (data) => {

    const serial = data['0']['Date de naissance']
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    const newDate = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate()).toLocaleDateString("fr-FR");

    return newDate
  }

  const Test_Match = (json, namecsv) => {
    var rep = "";
    let count = 0
    try {
      Array.from(json["sceances_list"]).forEach(item => {
        var full_name1 = item.name + " " + item.surname
        var full_name2 = item.surname + " " + item.name
        if (full_name1.toLowerCase() == namecsv.toLowerCase() || full_name2.toLowerCase() == namecsv.toLowerCase()) {
          count += 1
        }
      })
    } catch (err) {
      console.error(err)
    }
    if (count > 0) {
      rep = namecsv
    } else {
      rep = "faux"
    }
    return rep
  }

  const setJsonLoading = () => {
    if (TabletteFilePickUp.current != null) {
      SetdisabledButton(false);
    }
  }

  const Importation_Loop = () => {
    let fileLoadingCount = -1
    SetCardioFiles(cardioFilePickUp.current.files)
    SetTabletteFiles(TabletteFilePickUp.current.files)
    var tabFiles = TabletteFilePickUp.current.files
    const formData = []
    try {
      var reader = new FileReader();
      reader.onload = function (event) {
        var jsondelaTablette = JSON.parse(reader.result)
        Object.values(cardioFiles).forEach(cardioFile => {
          var readercsv = new FileReader();
          fileLoadingCount = fileLoadingCount !== -1 ? fileLoadingCount + 1 : 1
          readercsv.onload = function (event) {
            var workbook = XLSX.read(readercsv.result, { type: 'array' });
            // appel getData (suite de fonction pour gérer les datas)
            var data = getData(workbook);
            if (Test_Match(jsondelaTablette, data["nom_complet"]) != "faux") {
              let jsonTab = []
              for (let i = 0; i < jsondelaTablette["sceances_list"].length; i++) {
                if (jsondelaTablette["sceances_list"][i]["name"].toLowerCase() === data["nom"].toLowerCase() || jsondelaTablette["sceances_list"][i]["name"].toLowerCase() === data["prenom"].toLowerCase()) {
                  jsonTab = jsondelaTablette["sceances_list"][i]
                }
              }
              formData.push({
                jsonTablette: jsonTab,
                cardioJson: { time: data["time"], HR: data["HR"] },
                delta: "a récupérer",
                seanceType: "a récupérer",
                dateNaissance: data["date_naissance"],
                nom: data["nom"],
                prenom: data["prenom"],
                nomComplet: data["nom_complet"]
              })
            } else {
              console.log("modal")
              console.log(data["nom_complet"])
              // Ouvre une modal pour orphelin --> validation ou refus
              // regarder comment on construit la modal
            }
            console.log(formData)
            fileLoadingCount--
            if (fileLoadingCount === 0) {
              axios.post('http://localhost:8000/envoiCsv/', qs.stringify(formData), {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  "Access-Control-Allow-Origin": "*",
                }
              }).then(
                (res) => {
                  console.log(res)
                  // if (res.status == 200) {
                  //     setAlertShow(true)
                  //     setAlertColor("success")
                  //     setAlertText("Le patient a bien été supprimé")
                  // }else {
                  //     setAlertShow(true)
                  //     setAlertColor("danger")
                  //     setAlertText("Erreur, le patient n'a pas été supprimé")
                  // }
                  // setIsLoaded(true);
                  // handleClose();

                  // faire une action (voir laquel)
                }).then((error) => {
                  setIsLoaded(true);
                  setError(error);
                }
                )
              fileLoadingCount = -1
            }
        };
        readercsv.readAsArrayBuffer(cardioFile);
      })

    }
      reader.readAsText(tabFiles[0])
  } catch (err) {
    console.log(err)
  }
}

useEffect(() => {
    if (!isLoaded) {
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
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }

  }, [setIsLoaded, setError, isLoaded])


return (
  <>
    <Button variant="info" className="mx-auto d-block" style={{ height: "3em", width: "10%" }} onClick={handleShow}>Exporter les données</Button>

    <Modal show={show} onHide={handleClose} centered className="modal-90w modal-90h">
      <Modal.Header closeButton>
        <Modal.Title>Importez les dossiers</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ display: "flex" }}>
        <Row>
          <Col>
            <Row className="justify-content-center">
              <Image src="/pc_thumbnail.png" width="80%" rounded />
            </Row>
            <Row className="justify-content-center">
              <Form.File type="file" ref={cardioFilePickUp} style={{ width: "80%" }} className="mx-auto form-file-input" webkitdirectory='true' label={cardioPath} custom />
            </Row>
          </Col>
          <Col>
            <Row className="justify-content-center">
              <Image src="tab_thumbnail.png" width="44%" style={{ marginTop: "8.5%", marginBottom: "8%" }} rounded />
            </Row>
            <Row className="justify-content-center">
              <Form.File type="file" onChange={setJsonLoading} ref={TabletteFilePickUp} style={{ width: "80%" }} className="mx-auto form-file-input" webkitdirectory='true' label={tablettePath} custom />
            </Row>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="info" onClick={Importation_Loop} disabled={disabledButton} className="mx-auto d-block justify-content-center">Valider dossiers</Button>
      </Modal.Footer>
    </Modal>
  </>
);
}
export default Modal_Export;