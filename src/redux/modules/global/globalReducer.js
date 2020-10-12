import {
  GET_TICKER_SUCCESS,
  SET_BTC_TICKER
} from "./globalActionTypes";


const initialGlobalState = {
  btcTicker: []
};

//************************ REDUCER ************************************

export const globalReducer = (state = initialGlobalState, action) => {
  let newState = state;
  switch (action.type) {
    case GET_TICKER_SUCCESS:
      action.payload;
      newState = {
        ...state,
        tickers: {}
      };
      return newState; break;
    case SET_BTC_TICKER:
      action.payload;
      newState = {
        ...state,
        btcTicker: action.payload.split(",")
      };
      return newState; break;
    default:
      return state;
  }
};
