import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus',
  standalone: true
})
export class OrderStatusPipe implements PipeTransform {

  transform(statusId: number): { label: string, cssClass: string } {
    switch (statusId) {
      case 1: // InProcess
        return { label: 'In Lavorazione', cssClass: 'bg-yellow-100 text-yellow-800' };
      case 2: // Approved
        return { label: 'Approvato', cssClass: 'bg-blue-100 text-blue-800' };
      case 3: // Backordered
        return { label: 'In Attesa', cssClass: 'bg-orange-100 text-orange-800' };
      case 4: // Rejected
        return { label: 'Rifiutato', cssClass: 'bg-red-100 text-red-800' };
      case 5: // Shipped
        return { label: 'Spedito', cssClass: 'bg-indigo-100 text-indigo-800' };
      case 6: // Cancelled
        return { label: 'Annullato', cssClass: 'bg-gray-100 text-gray-600' };
      default:
        return { label: `Stato ${statusId}`, cssClass: 'bg-gray-100 text-gray-800' };
    }
  }
}