import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CreateHabitModal } from "../habit/create-habit-modal/create-habit-modal";
import { MatDialog } from '@angular/material/dialog';
import { LocalizationService } from '../../core/services/localization-service';
import { MatButton } from '@angular/material/button';
import { BidiModule } from "@angular/cdk/bidi";
import { HabitService } from '../../core/services/habit-service';
import { habit } from '../../core/models/habit.model';
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard.component',
  imports: [CreateHabitModal, MatButton, MatCard, MatCardContent, MatCardSubtitle, MatCardTitle,
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
  private habitService = inject(HabitService)
  protected habits = signal<habit[] | null>(null)

  openDialog() {
    const currentLang = this.localizationService.currentLanguage();
    const dialogRef = this.dialog.open(CreateHabitModal, {
      direction: currentLang === 'ar' ? "rtl" : "ltr"
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log('result', result);
    // })
  }

  async ngOnInit() {
    let result = await this.habitService.getAllByUser() as any
    let sortedResult: any = []
    result.forEach((habit: any) => {
      if (habit.frequencyType === 'daily') {
        const date = new Date();
        // Habit never completed before, so due date is today no matter what frequencyAmount (every X *frequencyType*).
        if (!habit.lastCompleted){
          if(!habit.timeOfDay) {
            habit.dueIn = date;
          }
          else {
            const [hour, minute, second] = habit.timeOfDay.split(':').map(Number);
            date.setHours(hour, minute, second)
            habit.dueIn = date;
          }
        }
        // TODOIMP: Handle this case - For lastCompleted, a user could have missed completing a habit and thus comparing lastCompleted to freqAmount
        // For example if daily habit is repeated every 2 days (freqAmount = 2), and lastCompleted was 3 days ago, then freqAmount < lastCompleted and not equal.
        // Maybe the user did the habit but didnt log it. So should the habit shown be the one from the day before or the one tommorow? (It's repeated every 2 days and lastCom was 3 days ago.)
        // Maybe implement a worker that sets missed habits as missed? then add a way to log forgotten completions. 
        else {
          
        }
      }
      else if (habit.frequencyType === 'weekly') {
        const date = new Date();
        // debugger;
      }
      else {

      }
    })
    this.habits.set(result);
    console.log(this.habits())   
  }

  protected completeHabit(habitId: string){
    // TODO: Add validation? is it time for completion now?
    this.habitService.habitComplete(habitId, new Date().toISOString())
  }
  
}
