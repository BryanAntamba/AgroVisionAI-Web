import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaAntenaWifi } from './alerta-antena-wifi';

describe('AlertaAntenaWifi', () => {
  let component: AlertaAntenaWifi;
  let fixture: ComponentFixture<AlertaAntenaWifi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaAntenaWifi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaAntenaWifi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
