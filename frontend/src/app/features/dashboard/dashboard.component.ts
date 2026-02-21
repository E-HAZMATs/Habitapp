import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CreateHabitModal } from "../habit/create-habit-modal/create-habit-modal";
import { MatDialog } from '@angular/material/dialog';
import { LocalizationService } from '../../core/services/localization-service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { BidiModule } from "@angular/cdk/bidi";
import { HabitService } from '../../core/services/habit-service';
import { habit } from '../../core/models/habit.model';
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { compareDateDays, getNextDayDate } from '../../core/utils/dates';

@Component({
  selector: 'app-dashboard.component',
  imports: [CreateHabitModal, MatButton, MatIconButton, MatIcon, MatCard, MatCardContent, MatCardSubtitle, MatCardTitle,
    TranslatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
// Agree to a naming convention. when I use ng g and put .component, it adds that to the identifier.
// my login comp is just Login.
export class DashboardComponent implements OnInit {
  readonly dialog = inject(MatDialog)
  private localizationService = inject(LocalizationService)
  private translate = inject(TranslateService)
  private habitService = inject(HabitService)
  protected habits = signal<habit[] | null>(null)

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
    await this.getHabits();
  }
  
  async getHabits(){
    let result = await this.habitService.getAllByUser() as any
    result.sort((a: habit, b: habit) => {
    return new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime();
  });
  
    result.forEach((habit: habit) => {
      habit.dueIn = this.getDueIn(habit.nextDueDate);
    })
    this.habits.set(result);
  }

  protected async deleteHabit(habitId: string){
    await this.habitService.delete(habitId);
    await this.getHabits();
  }

  protected async completeHabit(habitId: string){
    // TODO: Add validation? is it time for completion now?
    await this.habitService.habitComplete(habitId, new Date().toISOString())
    await this.getHabits();
  }

  protected getDueIn(nextDueIn: string){
    const now = new Date();
    const nextDueInDate = new Date(nextDueIn);
    const diffMs = nextDueInDate.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) // Should be ceil? if due in monday and today is tue, then it will give 5days.
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    return { diffDays, diffHours }
  }

  protected getCompleteBtnText(habit: habit){
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
        else  return this.translate.instant('dueInXDays', {"number": diffDays})
        break;
      case "weekly":
      case "monthly":
        if (diffDays === 1) return this.translate.instant('dueInOneDay')  
        else return this.translate.instant('dueInXDays', {"number": diffDays})
        break;
    }
  }
  
}
