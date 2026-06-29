import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAgricultor } from './panel-agricultor';

describe('PanelAgricultor', () => {
  let component: PanelAgricultor;
  let fixture: ComponentFixture<PanelAgricultor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelAgricultor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelAgricultor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
