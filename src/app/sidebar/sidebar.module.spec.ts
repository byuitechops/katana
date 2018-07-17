import { SidebarModule } from './sidebar.module';

describe('SidebarModule', () => {
  let sidebarModule: SidebarModule;

  beforeEach(() => {
    sidebarModule = new SidebarModule();
  });

  it('should create an instance', () => {
    expect(sidebarModule).toBeTruthy();
  });
});
