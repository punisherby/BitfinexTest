import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import ReduxThunk from "redux-thunk";

// import reducers
import { globalReducer } from "./modules/global/globalReducer";

// import sagas
import saga from "./sagas/saga";

// combine reducers
const reducers = combineReducers({
  global: globalReducer
});

// create saga middleware
const sagaMiddleware = createSagaMiddleware();

const middleware = applyMiddleware(ReduxThunk, sagaMiddleware);

// create a store using reducers and middleware
const store = createStore(reducers, compose(middleware));

// run saga middleware system
sagaMiddleware.run(saga);

// export store globally
export default store;
