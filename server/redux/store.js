const { createStore, applyMiddleware, combineReducers } = require('redux');
const thunkMiddleware = require('redux-thunk').default;
const {createLogger} =  require('redux-logger');

const { roomReducer } = require('./reducers/room-reducer');
const { socketReducer } = require('./reducers/socket-reducer');

const rootReducer = combineReducers({
  rooms: roomReducer,
  sockets: socketReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware
  )
);

module.exports = store;
