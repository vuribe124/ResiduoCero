import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardReportsComponent } from './card-reports.component';

describe('CardReportsComponent', () => {
  let component: CardReportsComponent;
  let fixture: ComponentFixture<CardReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
