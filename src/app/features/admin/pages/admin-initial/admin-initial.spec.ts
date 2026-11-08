import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInitial } from './admin-initial';

describe('AdminInitial', () => {
  let component: AdminInitial;
  let fixture: ComponentFixture<AdminInitial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInitial],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminInitial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
