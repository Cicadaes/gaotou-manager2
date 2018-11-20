import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitRouterComponent } from './limit-router.component';

describe('LimitRouterComponent', () => {
  let component: LimitRouterComponent;
  let fixture: ComponentFixture<LimitRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
