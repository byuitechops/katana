import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseChipComponent } from './course-chip.component';

describe('CourseChipComponent', () => {
  let component: CourseChipComponent;
  let fixture: ComponentFixture<CourseChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
