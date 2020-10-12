import { call, put, takeLatest, select, delay } from "redux-saga/effects";
import apis from "./apis";
import {GLOBAL_ACTIONS} from '../actionTypes';

const httpSuccessChecker = (response) => {
  if (!response) {
    return false;
  }
  const { ok, status } = response;
  return !(!ok && (status > 299 || status < 200)) ? true : false;
};

const $A = (type, payload) => ({
  type,
  payload
});

const getTickerRequestSaga = function* (action) {
  const symbol = action.payload;

  try {
    const response = yield call(apis.getTicker, symbol);
    if (response && httpSuccessChecker(response) && response.data) {
        yield put($A(GLOBAL_ACTIONS.GET_TICKER_SUCCESS, response.data));
    } else {
      throw new Error();
    }
  } catch (err) {
    console.log("error => ", err);
    yield put($A(GLOBAL_ACTIONS.GET_TICKER_FAILURE, err));
  }
};

// I HAVE INTEGRATED REDUX SAGA BUT WAS NOT NEEDED SINCE WE ONLY WORKED WITH REDUX SAGA FOR THE EXAM!!!
export default function* rootSaga() {
  yield takeLatest(GLOBAL_ACTIONS.GET_TICKER_REQUEST, getTickerRequestSaga);
}
