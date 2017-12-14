import React, { Component } from 'react';
import Menu from './components/Menu';
import routers from './routers/router';
import history from './routers/history';
import { Router, Switch, Route } from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <Router history={history}>
                <div>
                    <Menu />
                    <Switch>
                        {routers.map((route, i) => {
                            return <Route key={i} exact path={route.path} component={route.component}/>
                        })}
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
