import { Component, Input } from '@angular/core';
import { Item } from '../../../../shared/types/item';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-item-card',
  imports: [DecimalPipe],
  templateUrl: './item-card.html',
  styleUrl: './item-card.css',
})
export class ItemCard {
  @Input({ required: true }) item!: Item;
}
