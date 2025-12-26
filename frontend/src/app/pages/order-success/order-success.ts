import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-order-success',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, RouterLink],
    template: `
        <div class="flex justify-center items-center min-h-[60vh] px-4">
            <div class="text-center max-w-md">
                <mat-icon class="w-24! h-24! text-[96px]! text-green-500 mb-6">check_circle</mat-icon>

                <h1 class="text-3xl font-bold text-gray-900 mb-2">Ordine confermato!</h1>
                <p class="text-gray-600 text-lg mb-8">
                    Grazie per il tuo ordine. Il tuo ordine <span class="font-bold text-gray-900">#{{ orderId() }}</span> è stato ricevuto.
                </p>

                <div class="flex flex-col gap-3">
                    <a mat-flat-button color="primary" routerLink="/products" class="py-6!">
                        Torna ai prodotti
                    </a>
                </div>
            </div>
        </div>
    `
})
export default class OrderSuccessComponent implements OnInit {
    private route = inject(ActivatedRoute);
    orderId = signal<string>('');

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) this.orderId.set(id);
    }
}