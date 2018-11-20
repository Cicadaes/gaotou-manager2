import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerareaFieldsComponent } from './serarea-fields.component';

describe('SerareaFieldsComponent', () => {
  let component: SerareaFieldsComponent;
  let fixture: ComponentFixture<SerareaFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerareaFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerareaFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
