const canvas = require('canvas-api-wrapper');

module.exports = (body) => {
    return new Promise((resolve, reject) => {
        // ADD The account should be ${searchParams.account_id} instead of /1/, but we again, don't have all of the account info
        canvas.get(`/api/v1/accounts/${body.subAccount ? `${body.subAccount}` : '1'}/courses?search_by=${body.searchBy}&search_term=${body.searchPhrase}&include[]=term${body.term ? `&enrollment_term_id=${body.term}` : ''}&include[]=teachers${body.blueprint ? `&blueprint=${body.blueprint}` : ''}&per_page=50`, (err, courses) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            var formattedCourses = courses.map(course => {
                return {
                    id: course.id,
                    course_name: course.name,
                    course_code: course.course_code,
                    instructor: course.teachers[0] ? course.teachers[0].display_name : 'none',
                    account: course.account_id,
                    term: course.term.name,
                    blueprint: course.blueprint,
                    url: `https://byui.instructure.com/accounts/1/courses/${course.id}`
                }
            });
            resolve(formattedCourses);
        });
    });
};
