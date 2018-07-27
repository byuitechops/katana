const canvas = require('canvas-api-wrapper');

module.exports = (body) => {
    return new Promise((resolve, reject) => {
        // ADD In the URI, the enrollment_term_id needs to be part of the query, but we currently do not know which ids we're looking for so it is not included yet

        // ADD The account should be ${searchParams.account_id} instead of /1/, but we again, don't have all of the account info

        // console.log(`URI`, `/api/v1/accounts/${body.account ? `${body.account}` : '1'}/courses?search_by=course&search_term=${body.searchText}&include[]=term${body.term ? `&enrollment_term_id=${body.term}` : ''}&include[]=teachers${body.blueprint ? `&blueprint=${body.blueprint}` : ''}`);

        canvas.get(`/api/v1/accounts/${body.account ? `${body.account}` : '1'}/courses?search_by=${body.searchBy}&search_term=${body.searchPhrase}&include[]=term${body.term ? `&enrollment_term_id=${body.term}` : ''}&include[]=teachers${body.blueprint ? `&blueprint=${body.blueprint}` : ''}&per_page=50`, (err, courses) => {
            if (err) {
                console.error(err);
                reject(err);
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
