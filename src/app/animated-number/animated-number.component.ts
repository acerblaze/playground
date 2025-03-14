import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animated-number',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './animated-number.component.html',
  styleUrl: './animated-number.component.scss'
})
export class AnimatedNumberComponent implements OnInit, OnChanges {
  @Input() value: number = 0;
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() duration: number = 1000; // Animation duration in ms
  @Input() format: string = ''; // Format string (e.g., '0,0.00')

  @ViewChild('numberFlowContainer', { static: true }) container!: ElementRef;

  private numberFlowElement: any;

  constructor() {
    afterNextRender(() => {
      this.initNumberFlow();
    });
  }

  ngOnInit() {
    // Will be handled by afterNextRender
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && !changes['value'].firstChange && this.numberFlowElement) {
      this.updateValue();
    }
  }

  private async initNumberFlow() {
    try {
      // Dynamically import the number-flow library
      await import('number-flow');

      // Create the number-flow element
      this.numberFlowElement = document.createElement('number-flow');

      // Set attributes
      if (this.prefix) this.numberFlowElement.setAttribute('prefix', this.prefix);
      if (this.suffix) this.numberFlowElement.setAttribute('suffix', this.suffix);
      if (this.duration) this.numberFlowElement.setAttribute('duration', this.duration.toString());
      if (this.format) this.numberFlowElement.setAttribute('format', this.format);

      // Append to container
      this.container.nativeElement.appendChild(this.numberFlowElement);

      // Set initial value
      this.updateValue();
    } catch (error) {
      console.error('Error initializing number-flow:', error);
    }
  }

  private updateValue() {
    if (this.numberFlowElement) {
      this.numberFlowElement.update(this.value);
    }
  }
}
