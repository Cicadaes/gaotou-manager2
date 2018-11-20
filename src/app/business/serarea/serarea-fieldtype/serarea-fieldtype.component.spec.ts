import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerareaFieldtypeComponent } from './serarea-fieldtype.component';

describe('SerareaFieldtypeComponent', () => {
  let component: SerareaFieldtypeComponent;
  let fixture: ComponentFixture<SerareaFieldtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerareaFieldtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerareaFieldtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
