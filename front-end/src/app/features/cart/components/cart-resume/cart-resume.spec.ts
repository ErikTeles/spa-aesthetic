import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartResume } from './cart-resume';

describe('CartResume', () => {
  let component: CartResume;
  let fixture: ComponentFixture<CartResume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartResume],
    }).compileComponents();

    fixture = TestBed.createComponent(CartResume);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
