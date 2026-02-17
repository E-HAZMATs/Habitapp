import { Component, inject, OnInit, signal } from '@angular/core';
import { HabitService } from '../../../core/services/habit-service';
import { HabitLog, HabitLogPagination } from '../../../core/models/habit-log.model';

@Component({
  selector: 'app-habit-logs',
  imports: [],
  templateUrl: './habit-logs.component.html',
  styleUrl: './habit-logs.component.css',
})
export class HabitLogsComponent implements OnInit {
  private habitService = inject(HabitService);

  protected logs = signal<HabitLog[]>([]);
  protected pagination = signal<HabitLogPagination | null>(null);
  protected loading = signal(false);
  protected currentPage = signal(1);
  protected pageSize = 10; // Should add more sizes. 

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
}
