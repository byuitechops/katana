import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueApprovalComponent } from './issue-approval.component';

describe('IssueApprovalComponent', () => {
  let component: IssueApprovalComponent;
  let fixture: ComponentFixture<IssueApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
