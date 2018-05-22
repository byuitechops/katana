# Courses Service

This Angular service provides all the functionality used in managing currently selected courses. Selected courses determine which courses are target by any of Katana's tools.

A course object looks like this:

```
{
    course_id: <number>,
    course_code: <string>,
    course_name: <string>
}
```

## Properties
```
courses *<course[]>*
```
Holds all of the currently selected courses.

## Methods

### addCourse(courseId, courseName, coursecode)

Adds a single course to the currently selected courses.

### removeCourse(courseId)

Removes a course from the currently selected courses.
