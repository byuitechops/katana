export default function getStyles(elName) {
  return `
    .${elName}__frame {
      background-color: var(--color-3);
      height: 100vh;
      left: 0;
      top: 0;
      position: fixed;
      width: var(--sidebar-width);
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
  `;
}