import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFuncionarios } from './admin-funcionarios';

describe('AdminFuncionarios', () => {
  let component: AdminFuncionarios;
  let fixture: ComponentFixture<AdminFuncionarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFuncionarios],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminFuncionarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
