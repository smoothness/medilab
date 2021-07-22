import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementRegisterComponent } from './user-management-register.component';

describe('UserManagementRegisterComponent', () => {
  let component: UserManagementRegisterComponent;
  let fixture: ComponentFixture<UserManagementRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserManagementRegisterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
