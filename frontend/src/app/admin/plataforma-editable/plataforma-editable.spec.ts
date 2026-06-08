import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlataformaEditable } from './plataforma-editable';

describe('PlataformaEditable', () => {
  let component: PlataformaEditable;
  let fixture: ComponentFixture<PlataformaEditable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlataformaEditable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlataformaEditable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
