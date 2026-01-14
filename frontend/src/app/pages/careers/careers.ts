import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { GoogleFormDialogComponent } from '../../shared/components/google-form-dialog/google-form-dialog';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './careers.html',
  styleUrls: ['./careers.css'],
})
export class CareersComponent {
  private dialog = inject(MatDialog);

  openApplicationForm() {
    this.dialog.open(GoogleFormDialogComponent, {
      width: '940px',
      maxWidth: '95vw',
      data: {
        // Replace with your actual Google Form embed URL
        url: 'https://docs.google.com/forms/d/e/1FAIpQLSdEXAMPLE_FORM_ID/viewform?embedded=true'
      }
    });
  }
}
