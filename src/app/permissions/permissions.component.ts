import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

// Services & Models
import { PermissionService } from '../service/permission.service';
import { RoleMatrixRow, PermValue } from '../mock-data/role-matrix.mock';

interface ColumnDef {
  key: keyof Omit<RoleMatrixRow, 'type' | 'label' | 'feature'>;
  label: string;
  userCount: number;
}

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    TableModule, CheckboxModule, ButtonModule, SkeletonModule, ToastModule, TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  matrixData: RoleMatrixRow[] = [];
  originalData: string = '';   // JSON snapshot สำหรับ cancel
  loading = true;
  saving = false;

  readonly roleCols: ColumnDef[] = [
    { key: 'guest',       label: 'Guest',        userCount: 0 },
    { key: 'user',        label: 'User',         userCount: 0 },
    { key: 'staff',       label: 'Staff',        userCount: 0 },
    { key: 'visitor',     label: 'Visitor',      userCount: 0 },
    { key: 'checkAdmin',  label: 'Check Admin',  userCount: 0 },
    { key: 'inviteAdmin', label: 'Invite Admin', userCount: 0 },
    { key: 'admin',       label: 'Admin',        userCount: 1 },
    { key: 'superAdmin',  label: 'Super Admin',  userCount: 1 },
  ];

  constructor(
    private permissionService: PermissionService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.permissionService.getRoleMatrix().subscribe({
      next: (data) => {
        this.matrixData = data;
        this.originalData = JSON.stringify(data);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────

  isCategory(row: RoleMatrixRow): boolean {
    return row.type === 'category';
  }

  getPermValue(row: RoleMatrixRow, key: string): PermValue {
    return (row as any)[key] ?? null;
  }

  setPermValue(row: RoleMatrixRow, key: string, checked: boolean): void {
    (row as any)[key] = checked;
  }

  isNA(row: RoleMatrixRow, key: string): boolean {
    return (row as any)[key] === null || (row as any)[key] === undefined;
  }

  // ─── Actions ──────────────────────────────────────────────────────

  save(): void {
    this.saving = true;
    this.permissionService.saveRoleMatrix(this.matrixData).subscribe({
      next: () => {
        this.originalData = JSON.stringify(this.matrixData);
        this.saving = false;
        this.messageService.add({
          severity: 'success',
          summary: 'บันทึกสำเร็จ',
          detail: 'ข้อมูลสิทธิ์การใช้งานถูกบันทึกแล้ว',
          life: 3000
        });
      },
      error: () => {
        this.saving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'เกิดข้อผิดพลาด',
          detail: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          life: 3000
        });
      }
    });
  }

  cancel(): void {
    this.matrixData = JSON.parse(this.originalData);
    this.messageService.add({
      severity: 'info',
      summary: 'ยกเลิกการเปลี่ยนแปลง',
      detail: 'ข้อมูลถูกรีเซ็ตกลับสู่ค่าเดิม',
      life: 2000
    });
  }
}
