import React from 'react';
import { hot } from 'react-hot-loader';

import Game from 'routes/Game';

const App = props => <Game {...props} />;

const exporting = process.env.NODE_ENV === 'production' ? App : hot(module)(App);

export default exporting;
