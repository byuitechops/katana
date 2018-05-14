import {
    categories
} from './categories.mjs';

export default function getTools(categoryTitle) {

    var category = categories.find(category => category.title === categoryTitle);

    console.log(category);

}