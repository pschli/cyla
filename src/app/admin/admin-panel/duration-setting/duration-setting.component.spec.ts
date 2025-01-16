import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationSettingComponent } from './duration-setting.component';

describe('DurationSettingComponent', () => {
  let component: DurationSettingComponent;
  let fixture: ComponentFixture<DurationSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DurationSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DurationSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
