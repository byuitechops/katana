import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KatanaService {

  constructor() { }

  /*****************************************************************
   * Runs a tool on the server in discovery mode, then returns the issue items discovered.
   * @param {string} toolId - The ID of the tool to be run
   * @param {object[]} courses - Array of courses to be run (typically the currently selected courses)
   * @param {object} options - An object containing the option values specific to the tool
   * @returns {object[]} - Array of issue items discovered by the tool on the server
   ****************************************************************/
  discoverIssues(toolId, courses, options) {

    // TODO POST request to the server
    // NOTE should be able to just use URI, since it is sending request to current URL (i.e. just use "/tools/do_thing")

    // TODO JSON parse the response before returning the issue items

  }

  /*****************************************************************
   * Fixes the provided issue items in Canvas by sending them to the specified tool on the server.
   * @param {string} toolId - The ID of the tool to be run
   * @param {object[]} courses - Array of courses to be run (typically the currently selected courses)
   * @param {object} options - An object containing the option values specific to the tool
   * @param {object[]} issueItems - Array of issue items to be fixed by the specified tool
   * @returns {object[]} - Array of issue items fixed by the tool on the server
   ****************************************************************/
  fixIssues(toolId, courses, options, issueItems) {

    // TODO PUT request to the server

    // TODO JSON parse the response before returning the fixes issue items

  }
}
