import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import reducers from "./reducers";

const persistedState = sessionStorage.getItem("reduxState")
	? JSON.parse(sessionStorage.getItem("reduxState"))
	: {};

const configureStore = () => {
	const middlewares = [];
	if (process.env.REACT_APP_DONKEY !== "production") {
		middlewares.push(createLogger());
	}

	return createStore(reducers, persistedState, applyMiddleware(...middlewares));
};

const store = configureStore();

store.subscribe(() => {
	sessionStorage.setItem("reduxState", JSON.stringify(store.getState()));
});

export default store;

/*
window.addEventListener('storage',function(e){
   if(e.storageArea===sessionStorage){
     alert('change');
   } 
   // else, event is caused by an update to localStorage, ignore it
});
*/
