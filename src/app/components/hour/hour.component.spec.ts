import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourComponent } from './hour.component';

describe('HourComponent', () => {
  let component: HourComponent;
  let fixture: ComponentFixture<HourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
