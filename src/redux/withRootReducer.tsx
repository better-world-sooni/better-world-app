import React from 'react';
import {Provider} from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
// import reduxLogger from 'redux-logger';
import rootReducer from 'src/redux/rootReducer';
import reduxThunk from 'redux-thunk';
// import createSagaMiddleware from 'redux-saga'
// import rootSaga from './rootSaga'

// const sagaMiddleware = createSagaMiddleware()

// const configureStore = () => {
//   const enhancer = __DEV__ ?
//     composeWithDevTools(
//       applyMiddleware(sagaMiddleware, reduxThunk, reduxLogger)
//     ) :
//     compose(
//       applyMiddleware(sagaMiddleware, reduxThunk)
//     )
//   const store = createStore(rootReducer, enhancer)
//   sagaMiddleware.run(rootSaga)
//   return store
// }

const configureStore = () => {
  // const enhancer = __DEV__
  //   ? composeWithDevTools(applyMiddleware(reduxThunk, reduxLogger))
  //   : compose(applyMiddleware(reduxThunk));
  const enhancer = compose(applyMiddleware(reduxThunk));
  const store = createStore(rootReducer, enhancer);
  return store;
};

export const withRootReducer = Component => {
  const store = configureStore();
  return props => (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );
};
