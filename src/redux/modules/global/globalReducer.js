import {
  GET_TICKER_SUCCESS,
} from "./globalActionTypes";


const initialGlobalState = {
  tickers: {}
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
      return newState;

    default:
      return state;
  }
};
