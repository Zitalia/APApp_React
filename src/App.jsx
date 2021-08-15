import React from 'react';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard'
import Seance from './components/Seance/Seance'
import Patient from './components/Patient/Patient'
import Donnees from './components/Donnees/Donnees'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/dashboard"  component={Dashboard} />
          {/*<Route path="/seance"  component={Seance} />*/}
          <Route path="/patient"  component={Patient} />
          <Route path="/donnees"  component={Donnees} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
