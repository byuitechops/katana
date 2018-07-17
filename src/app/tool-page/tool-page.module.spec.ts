import { ToolPageModule } from './tool-page.module';

describe('ToolViewModule', () => {
    let toolPageModule: ToolPageModule;

    beforeEach(() => {
        toolPageModule = new ToolPageModule();
    });

    it('should create an instance', () => {
        expect(toolPageModule).toBeTruthy();
    });
});
