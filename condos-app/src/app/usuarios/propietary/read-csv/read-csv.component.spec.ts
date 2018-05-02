import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadCsvComponent } from './read-csv.component';

describe('ReadCsvComponent', () => {
  let component: ReadCsvComponent;
  let fixture: ComponentFixture<ReadCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
