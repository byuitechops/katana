import getStyles from './categoryItem-style.mjs';
import getTemplate from './categoryItem-template.mjs';

const elName = 'katana-category-item';

const styleEl = document.createElement('style');
styleEl.setAttribute('component', elName);
styleEl.textContent = getStyles(elName);
document.head.appendChild(styleEl);

class KatanaCategoryItem extends HTMLElement {
    constructor() {
        super();
        this.title = this.getAttribute('title');
        this.icon = this.getAttribute('icon');
    }

    connectedCallback() {
        this.innerHTML = getTemplate(elName, this.title, this.icon);
    }
}

customElements.define(elName, KatanaCategoryItem);