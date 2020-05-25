import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers';

const asyncActionMiddleware = store => next => action => {
  if(typeof action !== 'function') return next(action);
  action(store.dispatch);
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  reducer,
  composeEnhancers(applyMiddleware(asyncActionMiddleware))
);
