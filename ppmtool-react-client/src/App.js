import React, { Component } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Header from './components/Layout/Header';
import Landing from './components/Layout/Landing';
import Alert from './components/Layout/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AddProject from './components/Project/AddProject';
import { Provider } from 'react-redux';
import store from './store';
import UpdateProject from './components/Project/UpdateProject';
import ProjectBoard from './components/ProjectBoard/ProjectBoard';
import AddProjectTask from './components/ProjectBoard/ProjectTasks/AddProjectTask';
import UpdateProjectTask from './components/ProjectBoard/ProjectTasks/UpdateProjectTask';
import Register from './components/UserManagement/Register';
import Login from './components/UserManagement/Login';
import jwtDecode from "jwt-decode";
import setJWTToken from "./securityUtils/setJWTToken";
import { SET_CURRENT_USER } from "./actions/types";
import { logout } from "./actions/securityActions";
import SecuredRoute from "./securityUtils/SecureRoute";

const jwtToken = localStorage.jwtToken;

if (jwtToken) {
    setJWTToken(jwtToken);
    const decodedJwtToken = jwtDecode(jwtToken);
    store.dispatch({
        type: SET_CURRENT_USER,
        payload: decodedJwtToken
    });

    const currentTime = Date.now() / 1000;
    if (decodedJwtToken.exp < currentTime) {
        store.dispatch(logout());
        window.location.href = "/";
    }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Header />

            <Alert />

            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />

            <Switch>
                <SecuredRoute exact path="/dashboard" component={Dashboard} />
                <SecuredRoute exact path="/addProject" component={AddProject} />
                <SecuredRoute
                    exact
                    path="/updateProject/:id"
                    component={UpdateProject}
                />
                <SecuredRoute
                    exact
                    path="/projectBoard/:id"
                    component={ProjectBoard}
                />
                <SecuredRoute
                    exact
                    path="/addProjectTask/:id"
                    component={AddProjectTask}
                />
                <SecuredRoute
                    exact
                    path="/updateProjectTask/:backlogId/:ptId"
                    component={UpdateProjectTask}
                />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
