export default function getStyles(elName) {
  return `
    .${elName}__frame {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
    }
    .${elName}__container {
      width: 150px;
      height: 150px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .${elName}__icon {
      width: 100%;
      text-align: center;
      font-size: 80px;
      color: var(--color-3);
    }
    .${elName}__title {
      width: 100%;
      text-align: center;
      margin-top: 20px;
      font-size: 20px;
      color: var(--color-4);
    }
  `;
}