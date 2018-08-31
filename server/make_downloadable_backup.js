const canvas = require('canvas-api-wrapper');
// canvas.subdomain = 'byui'; not needed currently since the default is 'byui'

/**
 * Make a backup of the course and send the file's download url back to the client
 * @param {object} body The object that houses the course's id
 * @returns {object} The content export object that has the url to download the course's ".imscc" file 
 */
module.exports = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      // start the export
      let contentExport = await canvas.post(`/api/v1/courses/${body.id}/content_exports`, {
        export_type: 'common_cartridge',
        skip_notifications: true
      });

      let progress = {};
      // check the progress of the export every half-second until it is complete
      do {
        await new Promise(res => setTimeout(res, 500));
        progress = await canvas(contentExport.progress_url);
        console.log(progress.completion);
      } while (progress.workflow_state !== 'completed');

      // download the exported course with the content export
      let downloadedCourse = await canvas(`/api/v1/courses/${body.id}/content_exports/${contentExport.id}`);

      // return the downloadable url
      resolve(downloadedCourse.attachment);
    } catch (err) {
      reject(err);
    }
  });
};
