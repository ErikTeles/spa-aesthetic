import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemRow } from './cart-item-row';

describe('CartItemRow', () => {
  let component: CartItemRow;
  let fixture: ComponentFixture<CartItemRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemRow],
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
