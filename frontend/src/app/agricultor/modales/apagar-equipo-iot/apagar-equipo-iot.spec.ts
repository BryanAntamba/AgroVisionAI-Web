import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApagarEquipoIOT } from './apagar-equipo-iot';

describe('ApagarEquipoIOT', () => {
  let component: ApagarEquipoIOT;
  let fixture: ComponentFixture<ApagarEquipoIOT>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApagarEquipoIOT]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApagarEquipoIOT);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
