import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolService } from '../tool.service';

@Component({
  selector: 'app-options-view',
  templateUrl: './options-view.component.html',
  styleUrls: ['./options-view.component.css']
})
export class OptionsViewComponent implements OnInit {

  // NOTE the default options can be removed for production
  options = this.toolService.selectedTool.discoverOptions || [];

  constructor(public toolService: ToolService,
    private router: Router) { }

  ngOnInit() { }

  onSubmit() {
    let textInputs: any = document.querySelectorAll('#optionsForm input');
    let selectInputs: any = document.querySelectorAll('#optionsForm select');
    let options = [];

    textInputs.forEach(textInput => {
      let obj = {};
      obj[textInput.name] = textInput.value;
      options.push(obj);
    });

    selectInputs.forEach(selectInput => {
      Array.from(selectInput.selectedOptions).forEach(selectedOption => {
        let obj = {};
        obj[selectInput.name] = selectedOption['value'];
        options.push(obj);
      });
    });

    // Send somewhere
    console.log(options);
  }

  navToIssues() {
    this.router.navigate([`categories/tools/${this.toolService.selectedTool.id}/issues`]);
  }

  createOption(option) {
    let builders = {
      'text': this.buildTextInput,
      'dropdown': this.buildDropdownInput,
      'multiselect': this.buildMultiSelectInput
    }
    return builders[option.type](option, this.buildChoices(option.choices, option.defaults));
  }

  buildTextInput(option) {
    return `
      <h4>${option.title}</h4>
      <label for="option.title">${option.description}</label>
      <input type="text" name="${option.title}">
    `;
  }

  buildDropdownInput(option, choices = []) {
    return `
      <h4>${option.title}</h4>
      <label for="option.title">${option.description}</label>
      <select name="${option.title}" style="display: block">
        ${choices}
      </select>
    `;
  }

  buildMultiSelectInput(option, choices = []) {
    return `
      <h4>${option.title}</h4>
      <label for="option.title">${option.description}</label>
      <select name="${option.title}" style="display: block" multiple>
        ${choices}
      </select>
    `;
  }

  buildChoices(choices, defaults) {
    return choices.reduce((acc, choice) => acc += `<option value="${choice.key}" ${defaults.includes(choice.key) ? 'selected' : ''}>${choice.text}</option>`, '');
  }
}
