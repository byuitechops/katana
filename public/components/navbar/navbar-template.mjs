export default function getTemplate(elName) {
  return `
    <div class="${elName}__frame">
      <div class="${elName}__left">
        <katana-breadcrumbs></katana-breadcrumbs>
      </div>
      <div class="${elName}__right">
      
      </div>
    </div>
  `;
}