import {
  GET_TICKER_SUCCESS,
  SET_BTC_TICKER,
  SET_INITIALIZE_ORDERBOOK,
  SET_ORDERBOOK,
  SET_INITIALIZE_TRADES,
  SET_TRADES,
} from './globalActionTypes';


const initialGlobalState = {
  btcTicker: [],
  tradesStream: [],
  orderbookBuyStream: [],
  orderbookSellStream: []
};

//************************ REDUCER ************************************

export const globalReducer = (state = initialGlobalState, action) => {
  let newState = state;
  switch (action.type) {
    case GET_TICKER_SUCCESS:
      newState = {
        ...state,
        tickers: {}
      };
      return newState; break;
    case SET_BTC_TICKER:
      newState = {
        ...state,
        btcTicker: action.payload.split(",")
      };
      return newState; break;
    case SET_INITIALIZE_TRADES:
      newState = {
        ...state,
        tradesStream: action.payload.split("],[")
      };
      return newState; break;
    case SET_TRADES:
      let tmpTradesArr = [...state.tradesStream];
      tmpTradesArr.unshift(action.payload);
      newState = {
        ...state,
        tradesStream: tmpTradesArr.slice(0,20)
      };
      return newState; break;
    case SET_INITIALIZE_ORDERBOOK:
      let tmpOrderBookInitializeArr = action.payload.split("],[");
      let filterPositive = tmpOrderBookInitializeArr.filter((item) => {
        let singleItem = item.split(",");
        if(singleItem[2] > 0) return true;
      }).sort((a,b) => {
        let singleItemA = a.split(",");
        let singleItemB = b.split(",");
        return singleItemB[0] - singleItemA[0];
      }).slice(0,20);

      let filterNegative = tmpOrderBookInitializeArr.filter((item) => {
        let singleItem = item.split(",");
        if(singleItem[2] < 0) return true;
      }).sort((a,b) => {
        let singleItemA = a.split(",");
        let singleItemB = b.split(",");
        return singleItemA[0] - singleItemB[0];
      }).slice(0,20);

      newState = {
        ...state,
        orderbookBuyStream: filterPositive,
        orderbookSellStream: filterNegative
      };
      return newState; break;
    case SET_ORDERBOOK:

      let singleItem = action.payload.split(",");
      if(singleItem[2] > 0) {
        let tmpOrderBookBuyArr = [...state.orderbookBuyStream];
        tmpOrderBookBuyArr = tmpOrderBookBuyArr.filter((item) => {
          let subItem = item.split(",");
          if(subItem[0] != singleItem[0]) {
            return true;
          }
          return false;
        })
        tmpOrderBookBuyArr.push(action.payload);
        tmpOrderBookBuyArr.sort((a,b) => {
          let singleItemA = a.split(",");
          let singleItemB = b.split(",");
          return singleItemB[0] - singleItemA[0];
        });
        tmpOrderBookBuyArr = tmpOrderBookBuyArr.slice(0,20);

        newState = {
          ...state,
          orderbookBuyStream: tmpOrderBookBuyArr
        };
      } else {
        let tmpOrderBookSellArr = [...state.orderbookSellStream];
        tmpOrderBookSellArr = tmpOrderBookSellArr.filter((item) => {
          let subItem = item.split(",");
          if(subItem[0] != singleItem[0]) {
            return true;
          }
          return false;
        })
        tmpOrderBookSellArr.push(action.payload);
        tmpOrderBookSellArr.sort((a,b) => {
          let singleItemA = a.split(",");
          let singleItemB = b.split(",");
          return singleItemA[0] - singleItemB[0];
        });
        //tmpOrderBookSellArr = tmpOrderBookSellArr.slice(0,20);

        newState = {
          ...state,
          orderbookSellStream: tmpOrderBookSellArr
        };
      }

      return newState; break;
    default:
      return state;
  }
};
