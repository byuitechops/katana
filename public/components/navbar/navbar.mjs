import getStyles from './navbar-style.mjs';
import getTemplate from './navbar-template.mjs';

const elName = 'katana-navbar';

const styleEl = document.createElement('style');
styleEl.setAttribute('component', elName);
styleEl.textContent = getStyles(elName);
document.head.appendChild(styleEl);

class KatanaNavbar extends HTMLElement {
    constructor() {
        super();

    }

    connectedCallback() {
        this.innerHTML = getTemplate(elName);
    }
}

customElements.define(elName, KatanaNavbar);