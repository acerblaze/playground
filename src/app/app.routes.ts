import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'colors',
        loadComponent: () => import('./color-palette/color-palette.component').then(m => m.ColorPaletteComponent)
    },
    {
        path: 'charts',
        loadComponent: () => import('./charts/charts.component').then(m => m.ChartsComponent)
    },
    {
        path: '',
        redirectTo: 'colors',
        pathMatch: 'full'
    }
];
