import React, { useState, useEffect } from 'react';
import Card from "react-bootstrap/Card";
import Image from 'react-bootstrap/Image';
import axios from 'axios';

function CardsPatient(props) {
    const [items,SetItems] = useState([])
    const [error, setError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const triggercard = (item) => {
        return () => {
            props.getData(item)
        }
    }

    useEffect(() => {
          axios({
              method: 'post',
              url: "http://localhost:8000/getpatients",
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
              }
          })
              .then(
                  (result) => {
                      setIsLoaded(true);
                      SetItems(result.data);
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

return (
    <div style={{ display: "flex", 'flex-wrap': "wrap", 'margin-left': "10%" }}>
        {items.map((item, index) => {
            if (index < 20) {
                return (
                    <Card style={{ padding: '20px', margin: '20px', height: "20%", width: "40%", display: "flex", 'flex-direction': "row" }} onClick={triggercard(item)}>
                        <Image src="https://image.flaticon.com/icons/png/128/709/709699.png" style={{ height: '180px', width: '180px' }} />
                        <div>
                            <Card.Title>{item.first_name + " " + item.last_name}</Card.Title>
                            <Card.Body>
                                <p>Date de naissance : {item.birth_date}<br />Fréquence cardique Théorique : {item.theory}<br />Fréquence cardique réelle : {item.real}</p>
                            </Card.Body>
                        </div>
                    </Card>)
            }
        })}
        
    </div>
);
  }
export default CardsPatient;