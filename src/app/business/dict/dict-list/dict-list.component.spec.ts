import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictListComponent } from './dict-list.component';

describe('DictListComponent', () => {
  let component: DictListComponent;
  let fixture: ComponentFixture<DictListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DictListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
