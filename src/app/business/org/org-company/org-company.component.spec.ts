import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgCompanyComponent } from './org-company.component';

describe('OrgCompanyComponent', () => {
  let component: OrgCompanyComponent;
  let fixture: ComponentFixture<OrgCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
