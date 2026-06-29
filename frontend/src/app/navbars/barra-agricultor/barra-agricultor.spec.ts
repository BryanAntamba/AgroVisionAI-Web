import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraAgricultor } from './barra-agricultor';

describe('BarraAgricultor', () => {
  let component: BarraAgricultor;
  let fixture: ComponentFixture<BarraAgricultor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarraAgricultor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarraAgricultor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
