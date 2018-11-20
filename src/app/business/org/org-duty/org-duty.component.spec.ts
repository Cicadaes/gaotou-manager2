import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgDutyComponent } from './org-duty.component';

describe('OrgDutyComponent', () => {
  let component: OrgDutyComponent;
  let fixture: ComponentFixture<OrgDutyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgDutyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgDutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
