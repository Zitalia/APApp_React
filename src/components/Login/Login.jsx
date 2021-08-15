import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';

function Login() {
  const [state, setState] = useState({
    login: '',
    password: '',
    unvalid: false,
    logError : "",
  });

  const sendDetailsToServer = () => {
    if (state.login.length && state.password.length) {
      console.log('in sendDetails');
      setState((prevState) => ({
        ...prevState,
        unvalid: false,
      }));
      axios({
        method: 'post',
        url: 'http://localhost:8000/user/register',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
          login: state.login,
          password: state.password,
        }),
      })
        .then((response) => {
          console.log('in response');
          console.log(response);
          if ( response.data.auth === true) {
            localStorage.setItem("token", response.data.token)
            window.location = '/home';
          }
          return <Redirect to="/" />;
        })
        .catch((err) => {
          console.log(`error${err}`);
          setState((prevState) => ({
            ...prevState,
            logError: "echec du login merci de verifier votre login et mot de passe",
          }));
          return <Redirect to="/" />;
        });
    } else {
      setState((prevState) => ({
        ...prevState,
        unvalid: true,
      }));
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    sendDetailsToServer();
  };

  return (
    <div className="card login-card container justify-content col-4" style={{marginTop: "100px", padding: "50px", backgroundColor:"#009CE3"}}>
      {state.unvalid ? <h3>merci de remplir les deux champs</h3> : ''}
      <form >
        <div className="form-group text-center">
          <label htmlFor="login">
            Login
            <input
              type="login"
              className="form-control"
              id="login"
              placeholder="Enter login"
              value={state.login}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-group text-center">
          <label htmlFor="password">
            Password
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={state.password}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-group text-center">
        <button
          type="submit"
          className="btn btn-primary text-center"
          onClick={handleSubmitClick}
          style={{backgroundColor:"#002b59"}}
        >
          Register
        </button>
        </div>

        {state.logError !== "" ? <h5>{state.logError}</h5> : ''}
      </form>
    </div>
  );
}

export default Login;
