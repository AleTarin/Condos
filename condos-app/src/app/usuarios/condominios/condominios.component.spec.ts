import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CondominiosComponent } from './condominios.component';

describe('CondominiosComponent', () => {
  let component: CondominiosComponent;
  let fixture: ComponentFixture<CondominiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondominiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondominiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
