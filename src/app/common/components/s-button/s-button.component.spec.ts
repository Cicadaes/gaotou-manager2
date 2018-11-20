import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SButtonComponent } from './s-button.component';

describe('SButtonComponent', () => {
  let component: SButtonComponent;
  let fixture: ComponentFixture<SButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
