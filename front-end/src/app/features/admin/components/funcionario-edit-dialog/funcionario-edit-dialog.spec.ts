import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioEditDialog } from './funcionario-edit-dialog';

describe('FuncionarioEditDialog', () => {
  let component: FuncionarioEditDialog;
  let fixture: ComponentFixture<FuncionarioEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioEditDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(FuncionarioEditDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
