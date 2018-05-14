import getStyles from './categoryItem-style.mjs';
import getTemplate from './categoryItem-template.mjs';
import getTools from '../router/pages/tools.mjs';

const elName = 'katana-category-item';

const styleEl = document.createElement('style');
styleEl.setAttribute('component', elName);
styleEl.textContent = getStyles(elName);
document.head.appendChild(styleEl);

export default class KatanaCategoryItem extends HTMLElement {
    constructor(title, icon) {
        super();
        this.title = title;
        this.icon = icon;
    }

    connectedCallback() {
        this.innerHTML = getTemplate(elName, this.title, this.icon);
        this.addEventListener('click', () => {
            getTools(this.title);
        });
    }
}

customElements.define(elName, KatanaCategoryItem);