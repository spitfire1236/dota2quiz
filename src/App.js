import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

import { getRandom } from 'utils';

import Game from 'routes/Game';

class App extends Component {
    render() {
        return <Game {...this.props} />;
    }
}

const exporting = process.env.NODE_ENV === 'production' ? App : hot(module)(App);

export default exporting;
