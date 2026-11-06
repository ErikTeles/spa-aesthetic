import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditDialog } from './client-edit-dialog';

describe('ClientEditDialog', () => {
  let component: ClientEditDialog;
  let fixture: ComponentFixture<ClientEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientEditDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientEditDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
