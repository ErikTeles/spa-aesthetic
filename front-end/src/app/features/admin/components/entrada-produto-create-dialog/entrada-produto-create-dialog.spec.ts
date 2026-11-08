import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaProdutoCreateDialog } from './entrada-produto-create-dialog';

describe('EntradaProdutoCreateDialog', () => {
  let component: EntradaProdutoCreateDialog;
  let fixture: ComponentFixture<EntradaProdutoCreateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaProdutoCreateDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(EntradaProdutoCreateDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
