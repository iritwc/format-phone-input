import * as phone from './javascripts/phone.js';

const eventTarget = document.getElementById("phone");
eventTarget.addEventListener("keydown", phone.handleKeyDown);
eventTarget.addEventListener("keyup", phone.handleKeyUp);