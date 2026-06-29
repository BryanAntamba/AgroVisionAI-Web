import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraAdmin } from './barra-admin';

describe('BarraAdmin', () => {
  let component: BarraAdmin;
  let fixture: ComponentFixture<BarraAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarraAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarraAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
