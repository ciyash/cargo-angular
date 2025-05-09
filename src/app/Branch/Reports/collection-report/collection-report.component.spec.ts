import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionReportComponent } from './collection-report.component';

describe('CollectionReportComponent', () => {
  let component: CollectionReportComponent;
  let fixture: ComponentFixture<CollectionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionReportComponent]
    });
    fixture = TestBed.createComponent(CollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
