import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import Root from './components/Root.jsx';
import SOCKET from './socket'

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Root />
    </Router>
  </Provider>,
  document.getElementById('app') // make sure this is the same as the id of the div in your index.html
);