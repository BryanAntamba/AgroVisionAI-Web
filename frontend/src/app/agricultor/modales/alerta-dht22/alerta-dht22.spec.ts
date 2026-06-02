import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaDht22 } from './alerta-dht22';

describe('AlertaDht22', () => {
  let component: AlertaDht22;
  let fixture: ComponentFixture<AlertaDht22>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaDht22]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaDht22);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
