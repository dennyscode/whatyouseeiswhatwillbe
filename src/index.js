console.log("From Webpacker");
import './style.scss';
import {selectorjs, selectorjs__customs} from './selector';

let selectorjs_data = selectorjs__customs;
window.selectorjs_data = selectorjs_data;
console.log(selectorjs_data);
selectorjs(document.querySelector(".js-selector"));
