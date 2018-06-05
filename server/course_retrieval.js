const canvas = require('canvas-api-wrapper');

module.exports = (body) => {
    canvas.oncall = e => console.log(e.method,e.url);
    return new Promise((resolve, reject) => {
    // In the URI, the enrollment_term_id needs to be part of the query, but we 
    // currently do not know which ids we're looking for so it is not included yet

    // The account should be ${searchParams.account_id} instead of /1/, but we again
    // don't have all of the account info
    console.log(`searchParams`, body);
    console.log(`URI`, `/api/v1/accounts/1/courses?search_term=${body.searchText}&include[]=term&include[]=teachers&blueprint=${body.blueprint}`);

    canvas.get(`/api/v1/accounts/1/courses?search_term=${body.searchText}&include[]=term&include[]=teachers&blueprint=${body.blueprint}`, (err, courses) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      var formattedCourses = courses.map(course => {
        return {
            id: course.id,
            course_name: course.name,
            course_code: course.course_code,
            instructor: course.teachers[0] ? course.teachers[0].display_name : 'none' ,
            account: course.account_id,
            term: course.term.name,
            blueprint: course.blueprint,
            url: `https://byui.instructure.com/accounts/1/courses/${course.id}`
        }
      });
      console.log(`formattedCourses: `, typeof formattedCourses, formattedCourses);
      resolve(formattedCourses);
    });
  });
};
