export default function getStyles(elName) {
  return `
    .${elName}__frame {
      line-height: var(--navbar-height);
      margin-left: 20px;
      color: var(--color-2);
    }
    .${elName}__navArrow {
      display: inline-block;
      font-weight: bold;
      transform: scaleX(.6);
    }
  `;
}