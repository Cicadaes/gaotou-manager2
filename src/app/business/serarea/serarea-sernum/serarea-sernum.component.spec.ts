import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerareaSernumComponent } from './serarea-sernum.component';

describe('SerareaSernumComponent', () => {
  let component: SerareaSernumComponent;
  let fixture: ComponentFixture<SerareaSernumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerareaSernumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerareaSernumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
