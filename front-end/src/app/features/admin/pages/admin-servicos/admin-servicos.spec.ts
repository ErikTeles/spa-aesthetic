import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminServicos } from './admin-servicos';

describe('AdminServicos', () => {
  let component: AdminServicos;
  let fixture: ComponentFixture<AdminServicos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminServicos],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminServicos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
