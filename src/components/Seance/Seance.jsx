import React from 'react';
import { Container, Row, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import FormSeance from './FormSeance';

class Seance extends React.Component {

    displayForm = () => {
        if (
            document.getElementById("SeanceForm") &&
            document.getElementById("SeanceOrphelins")
        ) {
            document.getElementById("SeanceForm").style.display = "flex";
            document.getElementById("SeanceOrphelins").style.display = "none";
        }
    };

    displayElse = () => {
        if (
            document.getElementById("SeanceForm") &&
            document.getElementById("SeanceOrphelins")
        ) {
            document.getElementById("SeanceForm").style.display = "none";
            document.getElementById("SeanceOrphelins").style.display = "flex";
        }
    };

    render() {
        return (
            <Container fluid className="mb-5">
    
                <Row className="justify-content-center mt-5">
                    <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                        <ToggleButton className="justify-content-center" id="tbg-radio-1" variant="outline-primary" value={1} onChange={this.displayForm}>
                        Créer une séance
                        </ToggleButton>
                        <ToggleButton className="justify-content-center" id="tbg-radio-2" variant="outline-primary" value={2} onChange={this.displayElse}>
                        Obtenir les patients orphelins de séance
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Row>
    
                <Row id="SeanceForm" className="justify-content-center" style={{ Width: "80%", display: "flex" }} >
                    <FormSeance />
                </Row>
    
                <Row id="SeanceOrphelins" className="justify-content-center" style={{ display:"none" }}>
                    <div style={{ fontSize: '80px' }}>
                        BONJOUR IL FAUT REMPLIR CETTE PAGE
                    </div>
                </Row>
    
            </Container>
        );
    };
}

export default Seance;