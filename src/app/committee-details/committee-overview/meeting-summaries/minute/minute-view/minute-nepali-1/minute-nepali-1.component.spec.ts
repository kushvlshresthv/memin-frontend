import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinuteNepali1Component } from './minute-nepali-1.component';

describe('MinuteNepali1Component', () => {
  let component: MinuteNepali1Component;
  let fixture: ComponentFixture<MinuteNepali1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinuteNepali1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinuteNepali1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
