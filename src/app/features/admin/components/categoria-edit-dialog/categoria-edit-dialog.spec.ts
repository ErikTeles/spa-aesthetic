import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaEditDialog } from './categoria-edit-dialog';

describe('CategoriaEditDialog', () => {
  let component: CategoriaEditDialog;
  let fixture: ComponentFixture<CategoriaEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaEditDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaEditDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
