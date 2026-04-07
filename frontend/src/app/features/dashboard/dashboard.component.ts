import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateHabitModal } from "../habit/create-habit-modal/create-habit-modal";
import { MatDialog } from '@angular/material/dialog';
import { LocalizationService } from '../../core/services/localization-service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { BidiModule } from "@angular/cdk/bidi";
import { HabitService } from '../../core/services/habit-service';
import { Habit } from '../../core/models/habit.model';
import { HabitStatsMap } from '../../core/models/habit-log.model';
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-dashboard',
  imports: [CreateHabitModal, MatButton, MatIconButton, MatIcon, MatCard, MatCardContent, MatCardSubtitle, MatCardTitle,
    MatProgressSpinner, TranslatePipe, MatTooltip
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
// Agree to a naming convention. when I use ng g and put .component, it adds that to the identifier.
// my login comp is just Login.
export class DashboardComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog)
  private localizationService = inject(LocalizationService)
  private translate = inject(TranslateService)
  private habitService = inject(HabitService)
  protected habits = signal<Habit[] | null>(null)
  protected stats = signal<HabitStatsMap>({})
  protected loadingHabitIds = signal<Set<string>>(new Set())
  private dueInInterval: ReturnType<typeof setInterval> | null = null
  private static readonly DAY_CAP = 99;

  protected isHabitLoading(habitId: string): boolean {
    return this.loadingHabitIds().has(habitId);
  }

  setHabitLoading(habitId: string, loading: boolean) {
    this.loadingHabitIds.update(set => {
      const newSet = new Set(set);
      loading ? newSet.add(habitId) : newSet.delete(habitId);
      return newSet;
    });
  }

  openDialog() {
    const currentLang = this.localizationService.currentLanguage();
    const dialogRef = this.dialog.open(CreateHabitModal, {
      direction: currentLang === 'ar' ? "rtl" : "ltr"
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true)
        await this.getHabits();
    })
  }

  async ngOnInit() {
    await Promise.all([this.getHabits(), this.loadStats()]);
    this.dueInInterval = setInterval(() => {
      const habitsTemp = this.habits();
      if (!habitsTemp) return;
      this.habits.set(habitsTemp.map(h => ({ ...h, dueIn: this.getDueIn(h.nextDueDate) })));
    }, 60 * 1000);
  }

  ngOnDestroy() {
    if (this.dueInInterval !== null) {
      clearInterval(this.dueInInterval);
    }
  }
  
  async loadStats() {
    try {
      const result = await this.habitService.getStats();
      this.stats.set(result);
    } catch { }
  }

  async getHabits(){
    let result = await this.habitService.getAllByUser() as any
    result.sort((a: Habit, b: Habit) => {
    return new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime();
  });
  
    result.forEach((habit: Habit) => {
      habit.dueIn = this.getDueIn(habit.nextDueDate);
    })
    this.habits.set(result);
  }

  protected getHabitStat(habitId: string) {
    return this.stats()[habitId] ?? null;
  }

  protected completionRateColor(rate: number): string {
    if (rate === 100) return '#16a34a';
    if (rate >= 75)  return '#65a30d';
    if (rate >= 50)  return '#ca8a04';
    if (rate >= 25)  return '#ea580c';
    return '#dc2626';                 
  }

  openEditDialog(habit: Habit) {
    const currentLang = this.localizationService.currentLanguage();
    const dialogRef = this.dialog.open(CreateHabitModal, {
      direction: currentLang === 'ar' ? 'rtl' : 'ltr',
      data: habit,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true)
        await this.getHabits();
    });
  }

  protected deleteHabit(habitId: string){
    const currentLang = this.localizationService.currentLanguage();
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      direction: currentLang === 'ar' ? 'rtl' : 'ltr',
    });
    dialogRef.afterClosed().subscribe(async (confirmed) => {
      if (confirmed === true) {
        this.setHabitLoading(habitId, true);
        try {
          await this.habitService.delete(habitId);
          await this.getHabits();
        } finally {
          this.setHabitLoading(habitId, false);
        }
      }
    });
  }

  protected async completeHabit(habitId: string){
    this.setHabitLoading(habitId, true);
    try {
      await this.habitService.habitComplete(habitId, new Date().toISOString())
      await this.getHabits();
    } finally {
      this.setHabitLoading(habitId, false);
    }
  }

  protected getDueIn(nextDueIn: string){
    const now = new Date();
    const nextDueInDate = new Date(nextDueIn);
    const diffMs = nextDueInDate.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) // Should be ceil? if due in monday and today is tue, then it will give 5days.
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    return { diffDays, diffHours }
  }

  protected getCompleteBtnText(habit: Habit): string {
    const diffHours = habit.dueIn.diffHours;
    const diffDays = habit.dueIn.diffDays;
    if (diffHours <= 0) {return this.translate.instant('complete')}
    switch(habit.frequencyType){
      case "daily":
        if (diffHours === 1) return this.translate.instant('dueInOneHour')
        if(diffHours < 24){
          return this.translate.instant('dueInXHours', {"number": diffHours})
        }
        else if (diffDays === 1) {return this.translate.instant('dueInOneDay')} // usless?
        else if (diffDays > DashboardComponent.DAY_CAP) return this.translate.instant('dueInMoreThanXDays');
        else  return this.translate.instant('dueInXDays', {"number": diffDays})
        break;
      case "weekly":
      case "monthly":
        if (diffDays === 1) return this.translate.instant('dueInOneDay')  
        else if (diffDays > DashboardComponent.DAY_CAP) return this.translate.instant('dueInMoreThanXDays');
        else return this.translate.instant('dueInXDays', {"number": diffDays})
      
      default:
        return '';
    }
  }

  protected getCompleteBtnTooltip(habit: Habit): string | undefined {
    const diffDays = habit.dueIn.diffDays;
    if (habit.dueIn.diffHours <= 0) return undefined;
    if (diffDays > DashboardComponent.DAY_CAP)
      return this.translate.instant('dueInDaysTooltip', { number: diffDays });
    return undefined;
  }
  
}

@Component({
  selector: 'app-confirm-delete-dialog',
  imports: [MatDialogModule, MatButton, TranslatePipe],
  template: `
    <h2 mat-dialog-title>{{ 'confirmDeleteTitle' | translate }}</h2>
    <mat-dialog-content>{{ 'confirmDeleteMessage' | translate }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton mat-dialog-close>{{ 'cancel' | translate }}</button>
      <button matButton [mat-dialog-close]="true">{{ 'delete' | translate }}</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDeleteDialog {}
