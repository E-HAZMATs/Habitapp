import { Component, inject } from '@angular/core';
import { CreateHabitModal } from "../habit/create-habit-modal/create-habit-modal";
import { MatDialog } from '@angular/material/dialog';

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

  openDialog() {
    const dialogRef = this.dialog.open(CreateHabitModal);
    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result);
    })
  }
}
