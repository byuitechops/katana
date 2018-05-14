export default function getStyles(elName) {
  return `
    .${elName}__frame {
      height: var(--navbar-height);
      background-color: var(--color-4);
      width: 100%
      margin-bottom: 20px;
      display: flex;
    }
    .${elName}__left {
      display: flex;
      flex: 1 1 auto;
    }
    .${elName}__right {
      display: flex;
      text-align: right;
      flex: 1 1 auto;
    }
  `;
}