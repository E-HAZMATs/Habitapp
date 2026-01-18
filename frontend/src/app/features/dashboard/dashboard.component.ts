import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CreateHabitModal } from "../habit/create-habit-modal/create-habit-modal";
import { MatDialog } from '@angular/material/dialog';
import { LocalizationService } from '../../core/services/localization-service';
import { MatButton } from '@angular/material/button';
import { BidiModule } from "@angular/cdk/bidi";
import { HabitService } from '../../core/services/habit-service';
import { habit } from '../../core/models/habit.model';
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-dashboard.component',
  imports: [CreateHabitModal, MatButton, MatCard, MatCardContent, MatCardSubtitle, MatCardTitle],
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
    dialogRef.afterClosed().subscribe(result => {
      // console.log('result', result);
    })
  }

  async ngOnInit() {
    this.habits.set(await this.habitService.getAllByUser());
    console.log(this.habits())
  }

  protected completeHabit(habitId: string){
    // TODO: Add validation? is it time for completion now?
    this.habitService.habitComplete(habitId, new Date().toISOString())
  }
  
}
