import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarReporte } from './guardar-reporte';

describe('GuardarReporte', () => {
  let component: GuardarReporte;
  let fixture: ComponentFixture<GuardarReporte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardarReporte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardarReporte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
