import { CourseTabsModule } from './course-tabs.module';

describe('CourseTabsModule', () => {
    let courseTabsModule: CourseTabsModule;

    beforeEach(() => {
        courseTabsModule = new CourseTabsModule();
    });

    it('should create an instance', () => {
        expect(courseTabsModule).toBeTruthy();
    });
});
