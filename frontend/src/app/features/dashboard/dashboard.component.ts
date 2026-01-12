import { Component, inject } from '@angular/core';
import { CreateHabitModal } from "../habit/create-habit-modal/create-habit-modal";
import { MatDialog } from '@angular/material/dialog';
import { LocalizationService } from '../../core/services/localization-service';

@Component({
  selector: 'app-dashboard.component',
  imports: [CreateHabitModal],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
// Agree to a naming convention. when I use ng g and put .component, it adds that to the identifier.
// my login comp is just Login.
export class DashboardComponent {
  readonly dialog = inject(MatDialog)
  private localizationService = inject(LocalizationService)
  openDialog() {
    const currentLang = this.localizationService.currentLanguage();
    const dialogRef = this.dialog.open(CreateHabitModal, {
      direction: currentLang === 'ar' ? "rtl" : "ltr"
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('result', result);
    })
  }
}
