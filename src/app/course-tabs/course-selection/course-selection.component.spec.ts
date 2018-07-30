import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSelectionComponent } from './course-selection.component';

describe('CourseSelectionComponent', () => {
  let component: CourseSelectionComponent;
  let fixture: ComponentFixture<CourseSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
