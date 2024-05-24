import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSearchReportComponent } from './card-search-report.component';

describe('CardSearchReportComponent', () => {
  let component: CardSearchReportComponent;
  let fixture: ComponentFixture<CardSearchReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardSearchReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSearchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
