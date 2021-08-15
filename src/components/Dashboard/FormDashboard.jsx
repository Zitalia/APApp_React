import React from 'react';
import { Container, Row,  } from 'react-bootstrap';
import DashCollapse from './DashCollapse';


function FormDashboard(props) {
  //    console.log(props)
  return (
    <Container fluid>
      <Row className="justify-content-center mx-0 mt-5">
        <div className="col-lg 6">
          {
            props.Values.map((item, index) => {
              return (
                <div class="shadow p-3 mb-5 bg-white rounded " align="center">
                  <DashCollapse props={item}></DashCollapse>
                  
                </div>
              )

            })
        }

        </div>
      </Row>
    </Container>
  );


}
export default FormDashboard;