import React, { useState, useEffect } from 'react';
import {Button, Image} from 'react-bootstrap';
import ExportParameter from './ExportParameter'
import Modal_Export from './Modal_export'
import { isExpired, decodeToken } from "react-jwt";

let token = localStorage.getItem('token')

function Donnees() {

    useEffect(() => {
        console.log(token) 
        console.log(isExpired(token))
        console.log(decodeToken(token))
        if (isExpired(token)) {
            alert("Desolé votre session à expiré vous allez etre redirigé vers la page de login")
            localStorage.setItem('token', '')
            return window.location = '/';
        }
    })
    return (
        <>
        <ExportParameter />
        <div>
            <Image src="exportpng.png" width="40%" className="mx-auto d-block" fluid/>
            <Modal_Export />
        </div>
        </>
    );
  }
  export default Donnees;