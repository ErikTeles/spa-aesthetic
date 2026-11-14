import { Component } from '@angular/core';
import { ItemCard } from '../../components/item-card/item-card';
import { ItemList } from '../../components/item-list/item-list';

@Component({
  selector: 'app-catalog',
  imports: [ItemList],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {}
