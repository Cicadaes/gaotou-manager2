import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgDepartmentComponent } from './org-department.component';

describe('OrgDepartmentComponent', () => {
  let component: OrgDepartmentComponent;
  let fixture: ComponentFixture<OrgDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
