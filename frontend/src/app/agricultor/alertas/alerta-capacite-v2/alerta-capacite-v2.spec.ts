import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaCapaciteV2 } from './alerta-capacite-v2';

describe('AlertaCapaciteV2', () => {
  let component: AlertaCapaciteV2;
  let fixture: ComponentFixture<AlertaCapaciteV2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaCapaciteV2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaCapaciteV2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
