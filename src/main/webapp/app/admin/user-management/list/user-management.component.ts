import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AccountService } from 'app/core/auth/account.service';
import {Account, Doctor, Patient} from 'app/core/auth/account.model';
import { UserManagementService } from '../service/user-management.service';
import { User } from '../user-management.model';

@Component({
  selector: 'medi-user-mgmt',
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  currentUser: any;
  users: any[] = [];
  isLoading = false;

  constructor(
    private userService: UserManagementService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.accountService.formatUserIdentity().subscribe(account => {
      this.currentUser = account;
      this.loadAll();
    });
  }

  public loadAll(): void {
    this.isLoading = true;
    this.users = [];
    this.userService.getUsersFormatted().subscribe((user) => {
      this.users.push(user);
      this.isLoading = false;
    });
  }

  public viewProfile(user: any): void {
    switch (true) {
      case user instanceof Patient:
        this.router.navigate(['/main/patient', user.patientId, 'view']);
        break;

      case user instanceof Doctor:
        this.router.navigate(['/main/doctor', user.doctorId, 'view']);
        break;

      default:
        break;
    }
  }

  public redirectEditView(user: any): void {
   this.router.navigate(['/main/admin/user-management/', user.login, 'edit']);
  }

  public validateUser(user: any): boolean {
    let isCurrentUser = false;

    if (user.login === this.currentUser.login){
      isCurrentUser = true;
    }
    return isCurrentUser;
  }

  public validateAdmin(user: any): boolean {
    let isAdmin = true;

    if (user instanceof Account){
      isAdmin = false;
    }
    return isAdmin;
  }

  setActive(user: User, isActivated: boolean): void {
    this.userService.update({ ...user, activated: isActivated }).subscribe(() => this.loadAll());
  }
}
