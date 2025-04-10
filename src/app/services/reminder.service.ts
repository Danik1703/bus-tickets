import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { parseISO, differenceInMilliseconds } from 'date-fns';
import Swal from 'sweetalert2';
import { SuccessMessageService } from './success-message.service';

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  private reminders: any[] = [];
  private intervalSubscription: Subscription | null = null;

  constructor(private successMessageService: SuccessMessageService) {}

  addReminder(route: any): void {
    this.reminders.push(route);
    this.successMessageService.sendMessage('Маршрут додано до відстеження!');
    if (!this.intervalSubscription) {
      this.startCheckingReminders();
    }
  }

  private startCheckingReminders(): void {
    this.intervalSubscription = interval(60000).subscribe(() => {
      const now = new Date();

      this.reminders.forEach((reminder, index) => {
        const departureTime = parseISO(reminder.departureDateTime);
        const diff = differenceInMilliseconds(departureTime, now);

        if (diff <= 10 * 60 * 1000 && !reminder.notified) {
          reminder.notified = true;

          Swal.fire({
            title: '🚍 Нагадування',
            text: `Маршрут ${reminder.from} → ${reminder.to} відправляється через 10 хвилин!`,
            icon: 'info',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
          });
        }

        if (diff <= 0) {
          this.reminders.splice(index, 1);
        }
      });

      if (this.reminders.length === 0 && this.intervalSubscription) {
        this.intervalSubscription.unsubscribe();
        this.intervalSubscription = null;
      }
    });
  }
}