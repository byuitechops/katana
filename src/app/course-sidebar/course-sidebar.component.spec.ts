import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSidebarComponent } from './course-sidebar.component';

describe('CourseSidebarComponent', () => {
  let component: CourseSidebarComponent;
  let fixture: ComponentFixture<CourseSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
