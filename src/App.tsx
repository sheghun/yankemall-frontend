import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from './pages/home';

const App: React.FC = () => {
    return (
        <>
            <Switch>
                <Route path={'/'} component={Home} />
            </Switch>
        </>
    );
};

export default App;
