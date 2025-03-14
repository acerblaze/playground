import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

interface ColorGroup {
    name: string;
    colors: Color[];
}

interface Color {
    name: string;
    value: string;
    textColor: string;
}

@Component({
    selector: 'app-color-palette',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss']
})
export class ColorPaletteComponent {
    // Define color groups
    private semanticColors: ColorGroup = {
        name: 'Semantic Colors',
        colors: [
            { name: 'primary', value: 'var(--primary)', textColor: 'var(--text-light)' },
            { name: 'secondary', value: 'var(--secondary)', textColor: 'var(--text-dark)' },
            { name: 'background', value: 'var(--background)', textColor: 'var(--text-dark)' },
            { name: 'text-dark', value: 'var(--text-dark)', textColor: 'var(--text-light)' },
            { name: 'text-light', value: 'var(--text-light)', textColor: 'var(--text-dark)' }
        ]
    };

    private brandBlues: ColorGroup = {
        name: 'Brand Blues',
        colors: [
            { name: 'blue-900', value: 'var(--blue-900)', textColor: 'var(--text-light)' },
            { name: 'blue-800', value: 'var(--blue-800)', textColor: 'var(--text-light)' },
            { name: 'blue-700', value: 'var(--blue-700)', textColor: 'var(--text-light)' },
            { name: 'blue-600', value: 'var(--blue-600)', textColor: 'var(--text-light)' },
            { name: 'blue-500', value: 'var(--blue-500)', textColor: 'var(--text-light)' },
            { name: 'blue-400', value: 'var(--blue-400)', textColor: 'var(--text-light)' },
            { name: 'blue-300', value: 'var(--blue-300)', textColor: 'var(--text-light)' },
            { name: 'blue-200', value: 'var(--blue-200)', textColor: 'var(--text-dark)' },
            { name: 'blue-100', value: 'var(--blue-100)', textColor: 'var(--text-dark)' }
        ]
    };

    private neutrals: ColorGroup = {
        name: 'Neutrals',
        colors: [
            { name: 'neutral-900', value: 'var(--neutral-900)', textColor: 'var(--text-light)' },
            { name: 'neutral-800', value: 'var(--neutral-800)', textColor: 'var(--text-light)' },
            { name: 'neutral-700', value: 'var(--neutral-700)', textColor: 'var(--text-light)' },
            { name: 'neutral-600', value: 'var(--neutral-600)', textColor: 'var(--text-light)' },
            { name: 'neutral-500', value: 'var(--neutral-500)', textColor: 'var(--text-light)' },
            { name: 'neutral-400', value: 'var(--neutral-400)', textColor: 'var(--text-dark)' },
            { name: 'neutral-300', value: 'var(--neutral-300)', textColor: 'var(--text-dark)' },
            { name: 'neutral-200', value: 'var(--neutral-200)', textColor: 'var(--text-dark)' },
            { name: 'neutral-100', value: 'var(--neutral-100)', textColor: 'var(--text-dark)' },
            { name: 'neutral-50', value: 'var(--neutral-50)', textColor: 'var(--text-dark)' }
        ]
    };

    private chartColors: ColorGroup = {
        name: 'Chart Colors',
        colors: [
            { name: 'chart-teal-500', value: 'var(--chart-teal-500)', textColor: 'var(--text-light)' },
            { name: 'chart-teal-300', value: 'var(--chart-teal-300)', textColor: 'var(--text-dark)' },
            { name: 'chart-purple-500', value: 'var(--chart-purple-500)', textColor: 'var(--text-light)' },
            { name: 'chart-purple-300', value: 'var(--chart-purple-300)', textColor: 'var(--text-dark)' },
            { name: 'chart-green-500', value: 'var(--chart-green-500)', textColor: 'var(--text-light)' },
            { name: 'chart-green-300', value: 'var(--chart-green-300)', textColor: 'var(--text-dark)' },
            { name: 'chart-orange-500', value: 'var(--chart-orange-500)', textColor: 'var(--text-light)' },
            { name: 'chart-orange-300', value: 'var(--chart-orange-300)', textColor: 'var(--text-dark)' },
            { name: 'chart-red-500', value: 'var(--chart-red-500)', textColor: 'var(--text-light)' },
            { name: 'chart-red-300', value: 'var(--chart-red-300)', textColor: 'var(--text-dark)' }
        ]
    };

    // All color groups for reference
    colorGroups: ColorGroup[] = [
        this.semanticColors,
        this.brandBlues,
        this.neutrals,
        this.chartColors
    ];

    // Explicitly ordered color groups for display
    get orderedColorGroups(): ColorGroup[] {
        return [
            this.semanticColors,
            this.brandBlues,
            this.neutrals,
            this.chartColors
        ];
    }

    /**
     * Get colors by group name
     * @param groupName The name of the color group
     * @returns Array of colors for the specified group
     */
    getColorsByGroup(groupName: string): Color[] {
        const group = this.colorGroups.find(g => g.name === groupName);
        return group ? group.colors : [];
    }
} 