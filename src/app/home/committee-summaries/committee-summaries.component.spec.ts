import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeSummariesComponent } from './committee-summaries.component';

describe('CommitteeSummariesComponent', () => {
  let component: CommitteeSummariesComponent;
  let fixture: ComponentFixture<CommitteeSummariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitteeSummariesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommitteeSummariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
