export default function getStyles(elName) {
  return `
    .${elName}__frame {
      background-color: var(--color-3);
      height: 100vh;
      left: 0;
      top: 0;
      position: fixed;
      width: var(--sidebar-width);
      z-index: 2;
    }
    .${elName}__title {
      text-align: center;
      color: white;
      font-size: 14px;
      text-transform: uppercase;
      width: 100%;
    }
    .${elName}__arrow {
      position: absolute;
      bottom: 25px;
      color: white;
      width: var(--sidebar-width);
      text-align: center;
      font-size: 32px;
      cursor: pointer;
    }
    .${elName}__overlay {
      width: calc(100% - var(--sidebar-width));
      position: absolute;
      top: 0;
      left: -4000px;
      height: 100vh;
      background-color: var(--color-1);
      z-index: 1;
    }
  `;
}