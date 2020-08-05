import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "./Animations.css";
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

/*var sizeShow = document.getElementById("sizeShow");
console.log(sizeShow);
sizeShow.innerText = "res: " + window.innerWidth + ", " + window.innerHeight;

window.addEventListener("resize", (event) => {
  sizeShow.innerText = "res: " + window.innerWidth + ", " + window.innerHeight;
  console.log("size changed");
});*/

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
