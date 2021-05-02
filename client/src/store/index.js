import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/index.js";
import thunk from "redux-thunk";
/* const composed = compose(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(thunk))
 */

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
