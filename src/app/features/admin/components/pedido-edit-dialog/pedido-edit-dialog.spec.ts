import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoEditDialog } from './pedido-edit-dialog';

describe('PedidoEditDialog', () => {
  let component: PedidoEditDialog;
  let fixture: ComponentFixture<PedidoEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoEditDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(PedidoEditDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
