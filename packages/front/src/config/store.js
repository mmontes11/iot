import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";
import rootReducer from "reducers";

const middlewares = [thunk];
if (process.env.NODE_ENV !== "production") {
  middlewares.push(createLogger());
}
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));

export default store;
