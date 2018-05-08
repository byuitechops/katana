export default function getTemplate(elName) {
  return `
    <div class="${elName}__frame">
      <p class="${elName}__title noselect">Selected Courses</p>
      <span class="${elName}__arrow">🡒</span>
    </div>
  `;
}