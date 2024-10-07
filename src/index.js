import _ from "lodash";

function component() {
  var element = document.createElement("div");
  element.innerHTML = _.join(["Powered", "by", "Webpack"], " ");

  return element;
}

document.body.appendChild(component());
