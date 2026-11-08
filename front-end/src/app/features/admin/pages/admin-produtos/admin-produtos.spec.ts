import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProdutos } from './admin-produtos';

describe('AdminProdutos', () => {
  let component: AdminProdutos;
  let fixture: ComponentFixture<AdminProdutos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProdutos],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProdutos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
