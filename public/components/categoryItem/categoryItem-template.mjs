export default function getTemplate(elName, title, icon) {
  return `
    <div class="${elName}__frame">
        <div class="${elName}__container">
            <i class="${elName}__icon material-icons">${icon}</i>
            <div class="${elName}__title">${title}</div>
        </div>
    </div>
  `;
}