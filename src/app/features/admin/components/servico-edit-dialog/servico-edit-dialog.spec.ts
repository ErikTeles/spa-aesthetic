import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicoEditDialog } from './servico-edit-dialog';

describe('ServicoEditDialog', () => {
  let component: ServicoEditDialog;
  let fixture: ComponentFixture<ServicoEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicoEditDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicoEditDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
