import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitButtonComponent } from './limit-button.component';

describe('LimitButtonComponent', () => {
  let component: LimitButtonComponent;
  let fixture: ComponentFixture<LimitButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
