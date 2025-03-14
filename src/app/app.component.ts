import { Component, signal, computed, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AnimatedNumberComponent } from './animated-number/animated-number.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatCardModule,
    BaseChartDirective,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    AnimatedNumberComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = signal('playground');

  // Font family signal
  private fontFamilySignal = signal<'montserrat' | 'geist'>('montserrat');

  // Expose font family as a computed property
  public fontFamily = computed(() => this.fontFamilySignal());

  ngOnInit() {
    // Initialize font family on component creation
    this.updateFontFamily();

    // Check if there's a saved font preference
    const savedFont = localStorage.getItem('preferredFont');
    if (savedFont && (savedFont === 'montserrat' || savedFont === 'geist')) {
      this.setFontFamily(savedFont);
    }
  }

  ngAfterViewInit() {
    // Apply font again after view is initialized to ensure all components render with correct font
    setTimeout(() => {
      this.updateFontFamily();
    }, 0);
  }

  // Method to set font family
  setFontFamily(family: 'montserrat' | 'geist') {
    if (this.fontFamilySignal() === family) return; // Skip if same value

    this.fontFamilySignal.set(family);
    this.updateFontFamily();

    // Save preference
    localStorage.setItem('preferredFont', family);
  }

  // Method to update font family
  private updateFontFamily() {
    const family = this.fontFamilySignal();
    const fontVar = family === 'montserrat' ? '--font-montserrat' : '--font-geist';
    const letterSpacing = family === 'geist' ? '0.01em' : 'normal';

    console.log('Setting font family to:', family);

    // Update the CSS variable for the primary font
    document.documentElement.style.setProperty('--font-primary', `var(${fontVar})`);

    // Apply font family and letter spacing to the entire document
    document.documentElement.style.fontFamily = `var(${fontVar})`;
    document.documentElement.style.letterSpacing = letterSpacing;

    // Add a class to the body to allow specific styling based on font
    document.body.classList.remove('font-montserrat', 'font-geist');
    document.body.classList.add(`font-${family}`);

    // Dispatch a custom event that other components can listen for
    document.dispatchEvent(new CustomEvent('fontChanged', {
      detail: { family, fontVar, letterSpacing }
    }));
  }

  // Animated number value
  private valueSignal = signal(1234);
  public currentValue = computed(() => this.valueSignal());

  // Methods for animated number controls
  increaseValue() {
    this.valueSignal.update(val => val + 500);
  }

  decreaseValue() {
    this.valueSignal.update(val => Math.max(0, val - 500));
  }

  randomizeValue() {
    const randomValue = Math.floor(Math.random() * 10000);
    this.valueSignal.set(randomValue);
  }

  // Line chart data
  private lineChartDataSignal = signal<ChartConfiguration['data']>({
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        backgroundColor: 'rgba(0, 113, 235, 0.2)',
        borderColor: 'rgba(0, 113, 235, 1)',
        pointBackgroundColor: 'rgba(0, 113, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0, 113, 235, 0.8)',
        fill: 'origin',
      }
    ],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  });

  // Line chart options
  private lineChartOptionsSignal = signal<ChartOptions>({
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  });

  // Bar chart data
  private barChartDataSignal = signal<ChartConfiguration['data']>({
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        backgroundColor: 'rgba(0, 113, 235, 0.7)'
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Series B',
        backgroundColor: 'rgba(104, 211, 145, 0.7)'
      }
    ]
  });

  // Bar chart options
  private barChartOptionsSignal = signal<ChartOptions>({
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  });

  // Pie chart data
  private pieChartDataSignal = signal<ChartConfiguration['data']>({
    labels: ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'],
    datasets: [{
      data: [300, 500, 100, 40, 120],
      backgroundColor: [
        'rgba(0, 113, 235, 0.7)',
        'rgba(51, 214, 232, 0.7)',
        'rgba(159, 122, 234, 0.7)',
        'rgba(104, 211, 145, 0.7)',
        'rgba(246, 173, 85, 0.7)'
      ],
      hoverBackgroundColor: [
        'rgba(0, 113, 235, 1)',
        'rgba(51, 214, 232, 1)',
        'rgba(159, 122, 234, 1)',
        'rgba(104, 211, 145, 1)',
        'rgba(246, 173, 85, 1)'
      ]
    }]
  });

  // Pie chart options
  private pieChartOptionsSignal = signal<ChartOptions>({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  });

  // Radar chart data
  private radarChartDataSignal = signal<ChartConfiguration['data']>({
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 90, 81, 56, 55, 40],
        fill: true,
        backgroundColor: 'rgba(0, 113, 235, 0.2)',
        borderColor: 'rgb(0, 113, 235)',
        pointBackgroundColor: 'rgb(0, 113, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(0, 113, 235)'
      },
      {
        label: 'My Second Dataset',
        data: [28, 48, 40, 19, 96, 27, 100],
        fill: true,
        backgroundColor: 'rgba(159, 122, 234, 0.2)',
        borderColor: 'rgb(159, 122, 234)',
        pointBackgroundColor: 'rgb(159, 122, 234)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(159, 122, 234)'
      }
    ]
  });

  // Radar chart options
  private radarChartOptionsSignal = signal<ChartOptions>({
    responsive: true,
  });

  // Computed properties to expose the signals to the template
  public lineChartData = computed(() => this.lineChartDataSignal());
  public lineChartOptions = computed(() => this.lineChartOptionsSignal());
  public barChartData = computed(() => this.barChartDataSignal());
  public barChartOptions = computed(() => this.barChartOptionsSignal());
  public pieChartData = computed(() => this.pieChartDataSignal());
  public pieChartOptions = computed(() => this.pieChartOptionsSignal());
  public radarChartData = computed(() => this.radarChartDataSignal());
  public radarChartOptions = computed(() => this.radarChartOptionsSignal());
}
