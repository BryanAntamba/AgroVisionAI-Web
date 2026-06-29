import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaCam } from './alerta-cam';

describe('AlertaCam', () => {
  let component: AlertaCam;
  let fixture: ComponentFixture<AlertaCam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaCam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaCam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
