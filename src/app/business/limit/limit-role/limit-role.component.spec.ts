import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitRoleComponent } from './limit-role.component';

describe('LimitRoleComponent', () => {
  let component: LimitRoleComponent;
  let fixture: ComponentFixture<LimitRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
