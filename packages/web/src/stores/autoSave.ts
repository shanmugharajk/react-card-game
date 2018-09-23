import { autorun, toJS } from "mobx";

export default function(ins: any) {
  // https://gist.github.com/du5rte/dbd18a1a6dc72d866737a5e95ca1e663
  // will run on change
  autorun(() => {
    sessionStorage.setItem("store", JSON.stringify(toJS(ins)));
  });
}
