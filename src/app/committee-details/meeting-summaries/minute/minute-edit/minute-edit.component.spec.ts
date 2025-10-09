import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinuteEditComponent } from './minute-edit.component';

describe('MinuteEditComponent', () => {
  let component: MinuteEditComponent;
  let fixture: ComponentFixture<MinuteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinuteEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinuteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
