import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesconectarDispositivo } from './desconectar-dispositivo';

describe('DesconectarDispositivo', () => {
  let component: DesconectarDispositivo;
  let fixture: ComponentFixture<DesconectarDispositivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesconectarDispositivo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesconectarDispositivo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
