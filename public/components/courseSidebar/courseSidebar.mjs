import getStyles from './courseSidebar-style.mjs';
import getTemplate from './courseSidebar-template.mjs';

const elName = 'katana-sidebar';

const styleEl = document.createElement('style');
styleEl.setAttribute('component', elName);
styleEl.textContent = getStyles(elName);
document.head.appendChild(styleEl);

class KatanaSidebar extends HTMLElement {
    constructor() {
        super();
        this.potato = 'potato';
    }

    connectedCallback() {
        this.innerHTML = getTemplate(elName);

        // Give the arrow button the toggle functionality
        this.querySelector(`.${elName}__arrow`).addEventListener('click', this.toggleOverlay);
    }

    toggleOverlay() {
        var overlay = document.querySelector(`.${elName}__overlay`);
        var sidebarWidth = window.getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width').replace('px', '');
        var overlayWidth = getComputedStyle(overlay).width.replace('px', '');
        var toggleArrow = document.querySelector(`.${elName}__arrow`);
        overlay.style.left = overlay.style.left[0] === '-' || !overlay.style.left ? `${sidebarWidth}px` : `${-1 * overlayWidth}px`;
        toggleArrow.innerText = toggleArrow.innerText === '⮞' ? '⮜' : '⮞';
    }
}

customElements.define(elName, KatanaSidebar);