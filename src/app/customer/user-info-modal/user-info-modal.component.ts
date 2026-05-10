import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProfileFormComponent } from '../../components/profile-form/profile-form.component';

@Component({
  selector: 'app-user-info-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DialogModule, 
    ButtonModule,
    ProfileFormComponent
  ],
  template: `
    <p-dialog [(visible)]="visible" [showHeader]="false" [modal]="true" 
        [style]="{width: '750px', maxHeight: '90vh'}" [draggable]="false" 
        [resizable]="false" styleClass="customer-edit-dialog shadow-4 border-none"
        (onHide)="onClose()">
        
        <div class="overflow-y-auto" style="max-height: calc(90vh - 200px);">
            <div class="p-4" *ngIf="user">
                <!-- Reusable Profile Form -->
                <app-profile-form 
                    [user]="user" 
                    [roleOptions]="roleOptions"
                    [statusOptions]="statusOptions"
                    mode="edit">
                </app-profile-form>

            </div>
        </div>

        <ng-template pTemplate="footer">
            <div class="flex justify-content-between gap-2 pt-3">
                <p-button label="ยกเลิก" [text]="true" severity="secondary" (onClick)="onClose()"
                    icon="pi pi-times" styleClass="p-button-sm font-semibold"></p-button>
                <p-button label="บันทึกข้อมูล" severity="success" size="small" (onClick)="onSave()"
                    icon="pi pi-check" styleClass="font-semibold shadow-2" [loading]="loading"></p-button>
            </div>
        </ng-template>
    </p-dialog>
  `,
})
export class UserInfoModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() user: any = null;
  @Input() roleOptions: any[] = [];
  @Input() statusOptions: any[] = [];
  @Input() loading: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  onClose() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onSave() {
    if (this.user) {
      this.save.emit(this.user);
    }
  }
}
