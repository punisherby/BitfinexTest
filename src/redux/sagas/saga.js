import { all } from "redux-saga/effects";
import allSagas from "./allSagas";

export default function* saga() {
  yield all([allSagas()]);
}
