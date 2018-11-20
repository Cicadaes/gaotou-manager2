import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitMenuComponent } from './limit-menu.component';

describe('LimitMenuComponent', () => {
  let component: LimitMenuComponent;
  let fixture: ComponentFixture<LimitMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
