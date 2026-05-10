import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, DropdownModule],
  template: `
    <div class="p-fluid">
      <h3 class="mt-0 mb-4 text-700">Profile Information</h3>
      
      <div class="formgrid grid">
        <!-- Row 1: First Name | Last Name -->
        <div class="field col-12 md:col-6">
          <label for="firstName" class="font-medium">First Name <span class="text-red-500" *ngIf="mode === 'edit'">*</span></label>
          <input pInputText id="firstName" [(ngModel)]="user.firstName" [placeholder]="mode === 'edit' ? 'Enter first name' : ''" 
            [disabled]="mode === 'view'" class="w-full" />
        </div>

        <div class="field col-12 md:col-6">
          <label for="lastName" class="font-medium">Last Name <span class="text-red-500" *ngIf="mode === 'edit'">*</span></label>
          <input pInputText id="lastName" [(ngModel)]="user.lastName" [placeholder]="mode === 'edit' ? 'Enter last name' : ''" 
            [disabled]="mode === 'view'" class="w-full" />
        </div>

        <!-- Row 2: Email | Role -->
        <div class="field col-12 md:col-6">
          <label for="email" class="font-medium">Email</label>
          <input pInputText id="email" [(ngModel)]="user.email" [placeholder]="mode === 'edit' ? 'example@email.com' : ''" 
            [disabled]="mode === 'view'" class="w-full" />
        </div>

        <div class="field col-12 md:col-6">
          <label for="role" class="font-medium">Role <span class="text-red-500" *ngIf="mode === 'edit'">*</span></label>
          <p-dropdown [options]="roleOptions" [(ngModel)]="user.role" [placeholder]="mode === 'edit' ? 'Select role' : ''"
            [showClear]="mode === 'edit'" [disabled]="mode === 'view'" styleClass="w-full">
          </p-dropdown>
        </div>

        <!-- Row 3: Status | Phone -->
        <div class="field col-12 md:col-6">
          <label for="status" class="font-medium">Status</label>
          <p-dropdown [options]="statusOptions" [(ngModel)]="user.status" [placeholder]="mode === 'edit' ? 'Select status' : ''"
            [disabled]="mode === 'view'" styleClass="w-full">
          </p-dropdown>
        </div>

        <div class="field col-12 md:col-6" *ngIf="mode === 'edit' || (user.phone && user.phone !== '')">
          <label for="phone" class="font-medium">Phone Number</label>
          <input pInputText id="phone" [(ngModel)]="user.phone" [placeholder]="mode === 'edit' ? '08x-xxx-xxxx' : ''"
            [disabled]="mode === 'view' || isPhoneDisabled()" class="w-full" />
        </div>
      </div>
    </div>
  `
})
export class ProfileFormComponent implements OnInit {
  @Input() user: any = {};
  @Input() mode: 'edit' | 'view' = 'edit';
  @Input() roleOptions: any[] = [];
  @Input() statusOptions: any[] = [
    { label: 'Active', value: 'Active' },
    { label: 'Enabled', value: 'Active' }, // Support both for display
    { label: 'Pending', value: 'Pending' },
    { label: 'Blacklist', value: 'Blacklist' }
  ];

  constructor() {}

  ngOnInit(): void {}

  isPhoneDisabled(): boolean {
    if (!this.user || !this.user.role) return false;
    const restrictedRoles = ['Check Admin', 'Invite Admin', 'Admin', 'Super Admin', 'Super Administrator'];
    return restrictedRoles.includes(this.user.role);
  }
}
