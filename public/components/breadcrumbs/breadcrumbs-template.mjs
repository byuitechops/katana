export default function getTemplate(elName) {
  return `
    <div class="${elName}__frame">
      Home <span class="${elName}__navArrow">></span> Pages <span class="${elName}__navArrow">></span> Attribute Modifier
    </div>
  `;
}