import { Component, inject, OnInit, signal } from '@angular/core';
import { HabitService } from '../../../core/services/habit-service';
import { HabitLog, HabitLogPagination } from '../../../core/models/habit-log.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/divider';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { LocalizationService } from '../../../core/services/localization-service';

@Component({
  selector: 'app-habit-logs',
  imports: [
    MatProgressSpinner,
    MatCard, MatCardContent,
    MatChip,
    MatIconButton, MatIcon,
    MatDivider,
    TranslatePipe,
    DatePipe,
    MatTooltip,
  ],
  templateUrl: './habit-logs.component.html',
  styleUrl: './habit-logs.component.css',
})
export class HabitLogsComponent implements OnInit {
  private habitService = inject(HabitService);
  private localizationService = inject(LocalizationService);

  protected logs = signal<HabitLog[]>([]);
  protected pagination = signal<HabitLogPagination | null>(null);
  protected loading = signal(false);
  protected currentPage = signal(1);
  protected pageSize = 10;
  protected skippingLogIds = signal<Set<string>>(new Set());

  protected isSkipping(logId: string): boolean {
    return this.skippingLogIds().has(logId);
  }

  protected async markAsSkipped(logId: string): Promise<void> {
    this.skippingLogIds.update(s => new Set(s).add(logId));
    try {
      await this.habitService.markLogAsSkipped(logId);
      this.logs.update(logs => logs.map(l =>
        l.id === logId ? { ...l, status: 'skipped' as const } : l
      ));
    } catch {
    } finally {
      this.skippingLogIds.update(s => { const n = new Set(s); n.delete(logId); return n; });
    }
  }

  async ngOnInit() {
    await this.loadLogs();
  }

  async loadLogs(page: number = 1) {
    this.loading.set(true);
    try {
      const result = await this.habitService.getLogsByUser(page, this.pageSize);
      this.logs.set(result.logs);
      this.pagination.set(result.pagination);
      this.currentPage.set(page);
    } finally {
      this.loading.set(false);
    }
  }

  protected get dateFormat(): string {
    return this.localizationService.currentLanguage() === 'ar' ? 'dd/MM/yyyy' : 'mediumDate';
  }

  protected get dateTimeFormat(): string {
    return this.localizationService.currentLanguage() === 'ar' ? 'dd/MM/yyyy HH:mm' : 'medium';
  }
  
  protected getPageNumbers(): number[] {
    const total = this.pagination()?.totalPages ?? 1;
    const current = this.currentPage();
    const delta = 2;
    const start = Math.max(1, current - delta);
    const end = Math.min(total, current + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  protected showStartEllipsis(): boolean {
    return this.currentPage() > 4;
  }

  protected showEndEllipsis(): boolean {
    const total = this.pagination()?.totalPages ?? 1;
    return this.currentPage() < total - 3;
  }

  protected showFirstPage(): boolean {
    return this.currentPage() > 3;
  }

  protected showLastPage(): boolean {
    const total = this.pagination()?.totalPages ?? 1;
    return this.currentPage() < total - 2;
  }
}
