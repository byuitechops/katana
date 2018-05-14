import getStyles from './router-style.mjs';

/* Templates */
import getCategories from './pages/categories.mjs';

const elName = 'katana-router';

const styleEl = document.createElement('style');
styleEl.setAttribute('component', elName);
styleEl.textContent = getStyles(elName);
document.head.appendChild(styleEl);

var pages = [{
    route: '/Categories',
    retrieve: getCategories
}, {
    route: '/Tools',
    retrieve: getTools
}];

class KatanaRouter extends HTMLElement {
    constructor() {
        super();
    }



    connectedCallback() {
        this.appendChild(getCategories());
    }

    loadPage(page) {

    }
}

customElements.define(elName, KatanaRouter);