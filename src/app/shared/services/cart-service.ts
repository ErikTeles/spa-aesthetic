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
  public cartTotal = computed(() =>
    this.cart().reduce(
      (sum, cartItem) => sum + this.getUnitPrice(cartItem.item) * cartItem.quantity,
      0,
    ),
  );

  addToCart(item: Item): void {
    const currentItems = this.cart();
    const existingCartItem: CartItem | undefined = currentItems.find(
      (cartItem) => cartItem.item.idItem === item.idItem,
    );

    if (existingCartItem) {
      this.cart.set(
        currentItems.map((cartItem) =>
          cartItem.item.idItem === item.idItem
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      );
      return;
    }

    const newCartItem: CartItem = {
      item,
      quantity: 1,
    };

    this.cart.set([...currentItems, newCartItem]);
  }

  increaseQuantity(idItem: number): void {
    this.updateQuantity(idItem, (quantity) => quantity + 1);
  }

  decreaseQuantity(idItem: number): void {
    this.updateQuantity(idItem, (quantity) => Math.max(1, quantity - 1));
  }

  removeItemFromCart(item: Item): void {
    const currentItems = this.cart();
    const updatedItems = currentItems.filter((cartItem) => cartItem.item.idItem !== item.idItem);

    this.cart.set(updatedItems);
  }

  removeAllItemsFromCart(): void {
    this.cart.set([]);
  }

  getUnitPrice(item: Item): number {
    return item.tipoItem === 'S' ? item.preco : (item.precoVenda ?? item.preco);
  }

  private updateQuantity(idItem: number, update: (quantity: number) => number): void {
    this.cart.update((currentItems) =>
      currentItems.map((cartItem) =>
        cartItem.item.idItem === idItem
          ? { ...cartItem, quantity: update(cartItem.quantity) }
          : cartItem,
      ),
    );
  }
}
