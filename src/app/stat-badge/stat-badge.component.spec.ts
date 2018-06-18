import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatBadgeComponent } from './stat-badge.component';

describe('StatBadgeComponent', () => {
  let component: StatBadgeComponent;
  let fixture: ComponentFixture<StatBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
