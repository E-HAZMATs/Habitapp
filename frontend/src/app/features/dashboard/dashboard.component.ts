import { Component } from '@angular/core';
import { CreateHabitModal } from "../habit/create-habit-modal/create-habit-modal";

@Component({
  selector: 'app-dashboard.component',
  imports: [CreateHabitModal],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
// Agree to a naming convention. when I use ng g and put .component, it adds that to the identifier.
// my login comp is just Login.
export class DashboardComponent {

}
