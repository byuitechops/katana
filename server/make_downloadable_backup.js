const canvas = require('canvas-api-wrapper');
// canvas.subdomain = 'byui'; not needed currently since the default is 'byui'

module.exports = (body) => {
  return new Promise(async (resolve, reject) => {

    try {
      //   const courseId = '371';
      // start the export
      let contentExport = await canvas.post(`/api/v1/courses/${body.id}/content_exports`, {
        export_type: 'common_cartridge',
        skip_notifications: true
      });
      console.log(contentExport);


      let progress = {};
      // check the progress of the export every half-second until it is complete
      do {
        await new Promise(res => setTimeout(res, 500));
        progress = await canvas(contentExport.progress_url);
        console.log(progress.completion);
      } while (progress.workflow_state !== 'completed');

      // download the exported course with the content export
      let downloadedCourse = await canvas(`/api/v1/courses/${body.id}/content_exports/${contentExport.id}`);
      console.log(downloadedCourse);

      // return the downloadable url
      resolve(downloadedCourse.attachment);
    } catch (err) {
      reject(err);
    }
  });
};
