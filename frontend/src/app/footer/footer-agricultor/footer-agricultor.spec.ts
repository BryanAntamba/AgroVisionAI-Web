import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterAgricultor } from './footer-agricultor';

describe('FooterAgricultor', () => {
  let component: FooterAgricultor;
  let fixture: ComponentFixture<FooterAgricultor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterAgricultor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterAgricultor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
