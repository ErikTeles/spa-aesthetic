import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEntradaProdutos } from './admin-entrada-produtos';

describe('AdminEntradaProdutos', () => {
  let component: AdminEntradaProdutos;
  let fixture: ComponentFixture<AdminEntradaProdutos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEntradaProdutos],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEntradaProdutos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
