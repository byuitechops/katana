import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueNavComponent } from './issue-nav.component';

describe('IssueNavComponent', () => {
    let component: IssueNavComponent;
    let fixture: ComponentFixture<IssueNavComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IssueNavComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IssueNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
