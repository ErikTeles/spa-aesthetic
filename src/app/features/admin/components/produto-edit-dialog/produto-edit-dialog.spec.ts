import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoEditDialog } from './produto-edit-dialog';

describe('ProdutoEditDialog', () => {
  let component: ProdutoEditDialog;
  let fixture: ComponentFixture<ProdutoEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoEditDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoEditDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
