import getStyles from './sidebar-style.mjs';
import getTemplate from './sidebar-template.mjs';

const elName = 'katana-sidebar';

const styleEl = document.createElement('style');
styleEl.setAttribute('component', elName);
styleEl.textContent = getStyles(elName);
document.head.appendChild(styleEl);

class KatanaSidebar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = getTemplate(elName);
    }
}

customElements.define(elName, KatanaSidebar);