import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordConfirmacion } from './password-confirmacion';

describe('PasswordConfirmacion', () => {
  let component: PasswordConfirmacion;
  let fixture: ComponentFixture<PasswordConfirmacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordConfirmacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordConfirmacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
