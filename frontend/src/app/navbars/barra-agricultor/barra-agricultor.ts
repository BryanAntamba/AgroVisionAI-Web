import { Component, AfterViewInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-barra-agricultor',
  imports: [RouterLink],
  templateUrl: './barra-agricultor.html',
  styleUrl: './barra-agricultor.css',
})
export class BarraAgricultor implements AfterViewInit, OnDestroy {
  private collapseElement: HTMLElement | null = null;
  private isMenuOpen = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit() {
    this.collapseElement = this.el.nativeElement.querySelector('#adminNavbar');
  }

  toggleMenu() {
    const button = this.el.nativeElement.querySelector('.navbar-toggler');
    
    if (this.collapseElement) {
      this.isMenuOpen = !this.isMenuOpen;
      
      if (this.isMenuOpen) {
        this.renderer.addClass(this.collapseElement, 'show');
        this.renderer.setAttribute(button, 'aria-expanded', 'true');
      } else {
        this.renderer.removeClass(this.collapseElement, 'show');
        this.renderer.setAttribute(button, 'aria-expanded', 'false');
      }
    }
  }

  ngOnDestroy() {
    // Limpieza si es necesario
  }
}
