// import { create } from "mobx-persist";
import { Provider } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Home from "./components/Home/Home";
// import * as storage from "./stores/storage";
import gameStore from "./stores/store";

import "semantic-ui-css/semantic.min.css";

// const hydrate = create({
//   jsonify: true,
//   storage
// });

// storage.getItem("store").then(existingState => {
//   if (existingState) {
//     hydrate("store", gameStore, JSON.parse(existingState));
//   } else {
//     hydrate("store", gameStore, { gameInfo: {}, userInfo: {} });
//   }
// });

const Root = (
  <Provider store={gameStore}>
    <Home />
  </Provider>
);

ReactDOM.render(Root, document.getElementById("root") as HTMLElement);
