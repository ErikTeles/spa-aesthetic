import { computed, Injectable, signal } from '@angular/core';
import { Item } from '../types/item';
import { CartItem } from '../types/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = signal<CartItem[]>([]);
  public cartItems = this.cart.asReadonly();
  public cartItemsCount = computed(() => this.cart().reduce((sum, item) => sum + item.quantity, 0));

  addToCart(item: Item): void {
    const currentItems = this.cart();
    const existingCartItem: CartItem | undefined = currentItems.find(
      (cartItem) => cartItem.item.idItem === item.idItem,
    );

    if (existingCartItem) {
      const updatedItems = currentItems.map((cartItem) => {
        if (cartItem.item.idItem === item.idItem) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }

        return cartItem;
      });

      this.cart.set(updatedItems);
      return;
    }

    const newCartItem: CartItem = {
      item,
      quantity: 1,
    };

    this.cart.set([...currentItems, newCartItem]);
  }

  removeItemFromCart(item: Item): void {
    const currentItems = this.cart();
    const updatedItems = currentItems.filter((cartItem) => cartItem.item.idItem !== item.idItem);

    this.cart.set(updatedItems);
  }

  removeAllItemsFromCart(): void {
    this.cart.set([]);
  }
}
