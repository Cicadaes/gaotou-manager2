import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideomComponent } from './videom.component';

describe('VideomComponent', () => {
  let component: VideomComponent;
  let fixture: ComponentFixture<VideomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
