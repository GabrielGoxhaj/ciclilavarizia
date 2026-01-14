import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-google-form-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="w-full max-w-[1100px]">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-bold m-0">Modulo di candidatura</h2>
        <button mat-button (click)="close()">Chiudi</button>
      </div>

      <div class="border rounded-md overflow-hidden">
        <iframe [src]="safeUrl" width="100%" height="640" frameborder="0" class="block"></iframe>
      </div>
    </div>
  `,
})
export class GoogleFormDialogComponent {
  formUrl: string;
  safeUrl: SafeResourceUrl;

  constructor(
    private dialogRef: MatDialogRef<GoogleFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url?: string },
    private sanitizer: DomSanitizer
  ) {
    // Default placeholder - replace with your real Google Form embed URL
    this.formUrl = data?.url || 'https://docs.google.com/forms/d/e/1FAIpQLSdEXAMPLE_FORM_ID/viewform?embedded=true';
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.formUrl);
  }

  close() {
    this.dialogRef.close();
  }
}
