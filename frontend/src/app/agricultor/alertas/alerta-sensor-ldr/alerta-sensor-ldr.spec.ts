import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaSensorLDR } from './alerta-sensor-ldr';

describe('AlertaSensorLDR', () => {
  let component: AlertaSensorLDR;
  let fixture: ComponentFixture<AlertaSensorLDR>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaSensorLDR]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaSensorLDR);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
