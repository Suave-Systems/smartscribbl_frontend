import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private toastr = inject(ToastrService);

  success(message = 'successful', title = `Success!`) {
    this.toastr.success(message, title);
  }

  info(message = '', title = `Info`) {
    this.toastr.info(message, title, {
      closeButton: true,
      timeOut: 10000,
    });
  }

  warning(message = 'please try again', title = `Warning!`) {
    this.toastr.warning(message, title, {
      closeButton: true,
      timeOut: 10000,
    });
  }

  error(message = 'please try again', title = `Error`) {
    this.toastr.error(message, title, {
      closeButton: true,
      timeOut: 10000,
    });
  }
}
