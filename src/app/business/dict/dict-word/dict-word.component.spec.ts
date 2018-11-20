import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictWordComponent } from './dict-word.component';

describe('DictWordComponent', () => {
  let component: DictWordComponent;
  let fixture: ComponentFixture<DictWordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DictWordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
