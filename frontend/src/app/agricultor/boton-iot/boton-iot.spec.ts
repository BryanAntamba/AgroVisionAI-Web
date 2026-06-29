import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonIOT } from './boton-iot';

describe('BotonIOT', () => {
  let component: BotonIOT;
  let fixture: ComponentFixture<BotonIOT>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonIOT]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonIOT);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
