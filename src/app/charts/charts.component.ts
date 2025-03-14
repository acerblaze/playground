import { Component, signal, computed, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AnimatedNumberComponent } from '../animated-number/animated-number.component';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    BaseChartDirective,
    AnimatedNumberComponent
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})
export class ChartsComponent implements OnInit {
  // Color intensity signal
  private colorIntensitySignal = signal<'300' | '500'>('300');

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Apply current font to chart options
    this.updateChartFonts();

    // Listen for font changes
    const observer = new MutationObserver(() => {
      this.updateChartFonts();
      this.cdr.detectChanges();
    });

    // Observe body class changes which indicate font changes
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  // Method to update chart fonts based on current body class
  private updateChartFonts() {
    const isGeist = document.body.classList.contains('font-geist');
    const fontFamily = isGeist ? 'Geist Sans' : 'Montserrat';
    const letterSpacing = isGeist ? '0.01em' : 'normal';

    // Update all chart options with the current font
    this.updateChartOptionFonts(this.lineChartOptionsSignal, fontFamily, letterSpacing);
    this.updateChartOptionFonts(this.barChartOptionsSignal, fontFamily, letterSpacing);
    this.updateChartOptionFonts(this.pieChartOptionsSignal, fontFamily, letterSpacing);
    this.updateChartOptionFonts(this.radarChartOptionsSignal, fontFamily, letterSpacing);
  }

  // Helper method to update fonts in chart options
  private updateChartOptionFonts(optionsSignal: any, fontFamily: string, letterSpacing: string) {
    optionsSignal.update((options: ChartOptions) => {
      // Create a deep copy to ensure change detection
      const newOptions = JSON.parse(JSON.stringify(options));

      // Set global font for the chart
      if (!newOptions.font) {
        newOptions.font = {};
      }
      newOptions.font.family = fontFamily;

      // Update title and subtitle fonts if they exist
      if (newOptions.plugins?.title) {
        if (!newOptions.plugins.title.font) {
          newOptions.plugins.title.font = {};
        }
        newOptions.plugins.title.font.family = fontFamily;
      }

      if (newOptions.plugins?.subtitle) {
        if (!newOptions.plugins.subtitle.font) {
          newOptions.plugins.subtitle.font = {};
        }
        newOptions.plugins.subtitle.font.family = fontFamily;
      }

      // Update legend fonts if they exist
      if (newOptions.plugins?.legend) {
        if (!newOptions.plugins.legend.labels) {
          newOptions.plugins.legend.labels = {};
        }
        if (!newOptions.plugins.legend.labels.font) {
          newOptions.plugins.legend.labels.font = {};
        }
        newOptions.plugins.legend.labels.font.family = fontFamily;
      }

      return newOptions;
    });
  }

  // Brand and chart colors
  private brandColors = {
    // Brand blues
    primary: '#00184B',    // blue-900
    secondary: '#00BCFF',  // blue-100
    blue300: '#0071eb',    // blue-300
    blue400: '#0052c3',    // blue-400
    blue500: '#00339b',    // blue-500
    blue600: '#002c87',    // blue-600
    blue700: '#002573',    // blue-700

    // Neutrals
    neutral300: '#a5abb6', // neutral-300
    neutral400: '#838b9a', // neutral-400
    neutral500: '#616a7e', // neutral-500

    // Chart colors
    teal500: '#00a3b4',    // chart-teal-500
    teal300: '#33d6e8',    // chart-teal-300
    purple500: '#6b46c1',  // chart-purple-500
    purple300: '#9f7aea',  // chart-purple-300
    green500: '#38a169',   // chart-green-500
    green300: '#68d391',   // chart-green-300
    orange500: '#dd6b20',  // chart-orange-500
    orange300: '#f6ad55',  // chart-orange-300
    red500: '#e53e3e',     // chart-red-500
    red300: '#fc8181',     // chart-red-300
  };

  // Expose color intensity as a computed property
  public colorIntensity = computed(() => this.colorIntensitySignal());

  // Method to set color intensity
  setColorIntensity(intensity: '300' | '500') {
    if (this.colorIntensitySignal() === intensity) return; // Skip if same value

    this.colorIntensitySignal.set(intensity);
    this.updateChartColors();

    // Force refresh of charts
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  // Method to update chart colors based on intensity
  private updateChartColors() {
    const intensity = this.colorIntensitySignal();

    // Update line chart colors
    this.lineChartDataSignal.update(data => {
      if (data.datasets && data.datasets.length > 0) {
        const dataset = data.datasets[0] as any; // Type assertion to avoid property errors
        dataset.backgroundColor = `${this.getColor('blue', intensity)}33`; // 20% opacity
        dataset.borderColor = this.getColor('blue', intensity);
        dataset.pointBackgroundColor = this.getColor('blue', intensity);
        dataset.pointHoverBorderColor = this.getColor('blue', intensity);
      }
      return { ...data }; // Return a new object to trigger change detection
    });

    // Update bar chart colors
    this.barChartDataSignal.update(data => {
      if (data.datasets && data.datasets.length > 0) {
        data.datasets[0].backgroundColor = this.getColor('blue', intensity);
        data.datasets[0].hoverBackgroundColor = this.brandColors.primary;

        if (data.datasets.length > 1) {
          data.datasets[1].backgroundColor = this.getColor('green', intensity);
          data.datasets[1].hoverBackgroundColor = this.getColor('green', '500');
        }
      }
      return { ...data }; // Return a new object to trigger change detection
    });

    // Update pie chart colors
    this.pieChartDataSignal.update(data => {
      if (data.datasets && data.datasets.length > 0) {
        data.datasets[0].backgroundColor = [
          this.getColor('blue', intensity),
          this.getColor('teal', intensity),
          this.getColor('purple', intensity),
          this.getColor('green', intensity),
          this.getColor('orange', intensity)
        ];
        data.datasets[0].hoverBackgroundColor = [
          intensity === '300' ? this.brandColors.primary : this.getColor('blue', '500'),
          intensity === '300' ? this.getColor('teal', '500') : this.getColor('teal', '500'),
          intensity === '300' ? this.getColor('purple', '500') : this.getColor('purple', '500'),
          intensity === '300' ? this.getColor('green', '500') : this.getColor('green', '500'),
          intensity === '300' ? this.getColor('orange', '500') : this.getColor('orange', '500')
        ];
      }
      return { ...data }; // Return a new object to trigger change detection
    });

    // Update radar chart colors
    this.radarChartDataSignal.update(data => {
      if (data.datasets && data.datasets.length > 0) {
        const dataset1 = data.datasets[0] as any; // Type assertion to avoid property errors
        dataset1.backgroundColor = `${this.getColor('blue', intensity)}33`; // 20% opacity
        dataset1.borderColor = this.getColor('blue', intensity);
        dataset1.pointBackgroundColor = this.getColor('blue', intensity);
        dataset1.pointHoverBorderColor = this.getColor('blue', intensity);

        if (data.datasets.length > 1) {
          const dataset2 = data.datasets[1] as any; // Type assertion to avoid property errors
          dataset2.backgroundColor = `${this.getColor('purple', intensity)}33`; // 20% opacity
          dataset2.borderColor = this.getColor('purple', intensity);
          dataset2.pointBackgroundColor = this.getColor('purple', intensity);
          dataset2.pointHoverBorderColor = this.getColor('purple', intensity);
        }
      }
      return { ...data }; // Return a new object to trigger change detection
    });
  }

  // Helper method to get color based on color name and intensity
  private getColor(colorName: 'blue' | 'teal' | 'purple' | 'green' | 'orange' | 'red', intensity: '300' | '500'): string {
    const colorKey = `${colorName}${intensity}` as keyof typeof this.brandColors;
    return this.brandColors[colorKey];
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
        backgroundColor: `${this.brandColors.blue300}33`, // 20% opacity
        borderColor: this.brandColors.blue300,
        pointBackgroundColor: this.brandColors.blue300,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: this.brandColors.blue300,
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
        beginAtZero: true,
        grid: {
          color: '#e5e5e5'
        },
        ticks: {
          color: this.brandColors.neutral500
        }
      },
      x: {
        grid: {
          color: '#e5e5e5'
        },
        ticks: {
          color: this.brandColors.neutral500
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Monthly Performance',
        color: this.brandColors.primary,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      subtitle: {
        display: true,
        text: 'Data from 2023',
        color: this.brandColors.neutral500,
        font: {
          size: 14
        },
        padding: {
          bottom: 20
        }
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
        backgroundColor: this.brandColors.blue300,
        hoverBackgroundColor: this.brandColors.primary
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Series B',
        backgroundColor: this.brandColors.green300,
        hoverBackgroundColor: this.brandColors.green500
      }
    ]
  });

  // Bar chart options
  private barChartOptionsSignal = signal<ChartOptions>({
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e5e5'
        },
        ticks: {
          color: this.brandColors.neutral500
        }
      },
      x: {
        grid: {
          color: '#e5e5e5'
        },
        ticks: {
          color: this.brandColors.neutral500
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Annual Growth',
        color: this.brandColors.primary,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      subtitle: {
        display: true,
        text: 'Comparison by year',
        color: this.brandColors.neutral500,
        font: {
          size: 14
        },
        padding: {
          bottom: 20
        }
      }
    }
  });

  // Pie chart data
  private pieChartDataSignal = signal<ChartConfiguration['data']>({
    labels: ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'],
    datasets: [{
      data: [300, 500, 100, 40, 120],
      backgroundColor: [
        this.brandColors.blue300,
        this.brandColors.teal300,
        this.brandColors.purple300,
        this.brandColors.green300,
        this.brandColors.orange300
      ],
      hoverBackgroundColor: [
        this.brandColors.primary,
        this.brandColors.teal500,
        this.brandColors.purple500,
        this.brandColors.green500,
        this.brandColors.orange500
      ]
    }]
  });

  // Pie chart options
  private pieChartOptionsSignal = signal<ChartOptions>({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: this.brandColors.neutral500
        }
      },
      title: {
        display: true,
        text: 'Sales Distribution',
        color: this.brandColors.primary,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      subtitle: {
        display: true,
        text: 'By channel',
        color: this.brandColors.neutral500,
        font: {
          size: 14
        },
        padding: {
          bottom: 20
        }
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
        backgroundColor: `${this.brandColors.blue300}33`, // 20% opacity
        borderColor: this.brandColors.blue300,
        pointBackgroundColor: this.brandColors.blue300,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: this.brandColors.blue300
      },
      {
        label: 'My Second Dataset',
        data: [28, 48, 40, 19, 96, 27, 100],
        fill: true,
        backgroundColor: `${this.brandColors.purple300}33`, // 20% opacity
        borderColor: this.brandColors.purple300,
        pointBackgroundColor: this.brandColors.purple300,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: this.brandColors.purple300
      }
    ]
  });

  // Radar chart options
  private radarChartOptionsSignal = signal<ChartOptions>({
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Activity Metrics',
        color: this.brandColors.primary,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      subtitle: {
        display: true,
        text: 'Daily habits comparison',
        color: this.brandColors.neutral500,
        font: {
          size: 14
        },
        padding: {
          bottom: 20
        }
      }
    },
    scales: {
      r: {
        ticks: {
          color: this.brandColors.neutral500
        },
        grid: {
          color: '#e5e5e5'
        },
        pointLabels: {
          color: this.brandColors.neutral500
        }
      }
    }
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
