import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropietaryMainComponent } from './propietary-main.component';

describe('PropietaryMainComponent', () => {
  let component: PropietaryMainComponent;
  let fixture: ComponentFixture<PropietaryMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropietaryMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropietaryMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
