import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from '../../../../shared/services/cart-service';
import { CheckoutDialog } from '../checkout-dialog/checkout-dialog';

@Component({
  selector: 'app-cart-resume',
  imports: [DecimalPipe],
  templateUrl: './cart-resume.html',
  styleUrl: './cart-resume.css',
})
export class CartResume {
  public cartService = inject(CartService);
  private dialog = inject(MatDialog);

  openCheckout(): void {
    if (this.cartService.cartItems().length === 0) {
      return;
    }

    this.dialog.open(CheckoutDialog, {
      width: '40rem',
      maxWidth: '95vw',
      autoFocus: 'first-tabbable',
      restoreFocus: true,
    });
  }
}
