import getStyles from './breadcrumbs-style.mjs';
import getTemplate from './breadcrumbs-template.mjs';

const elName = 'katana-breadcrumbs';

const styleEl = document.createElement('style');
styleEl.setAttribute('component', elName);
styleEl.textContent = getStyles(elName);
document.head.appendChild(styleEl);

class KatanaBreadcrumbs extends HTMLElement {
    constructor() {
        super();

    }

    connectedCallback() {
        this.innerHTML = getTemplate(elName);
    }
}

customElements.define(elName, KatanaBreadcrumbs);