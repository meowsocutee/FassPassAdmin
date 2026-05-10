import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService, MessageService } from 'primeng/api';

import { UserManagementService, UserManagementResponse } from '../service/user-management.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserUtils } from '../utils/user-utils';
import { UserInfoModalComponent } from './user-info-modal/user-info-modal.component';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  category: 'Internal' | 'External' | 'Hybrid' | '';
  role: string;
  authMethod: string;
  status: string;
  lastActive: string;
  registerDate: string;
  expiryDate: string | null;
  avatarUrl?: string;
}

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TableModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    AvatarModule,
    TagModule,
    TooltipModule,
    BadgeModule,
    ProgressSpinnerModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    CheckboxModule,
    InputNumberModule,
    UserInfoModalComponent
  ],
  templateUrl: './customer.component.html',
  styles: [`
    /* Custom scrollbar for mobile sidebar tabs */
    .overflow-x-auto::-webkit-scrollbar {
      display: none;
    }
    .overflow-x-auto {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    :host ::ng-deep .p-dialog .p-dialog-header {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 1.5rem;
    }
    :host ::ng-deep .p-dialog .p-dialog-content {
      padding: 2rem;
    }
    :host ::ng-deep .p-dialog .p-dialog-footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 1rem 1.5rem;
    }
  `],
  providers: [UserManagementService, ConfirmationService, MessageService]
})
export class CustomerComponent implements OnInit {

  // State
  selectedUsers: User[] = [];
  searchTerm: string = '';
  first: number = 0;

  // Supabase Client
  supabase: SupabaseClient = createClient(
    'https://unxcjdypaxxztywplqdv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVueGNqZHlwYXh4enR5d3BscWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTA1NTQsImV4cCI6MjA3NzMyNjU1NH0.vf6ox-MLQsyzQgPCF9t6t_yPbcoMhJJNkJd1A-mS7WA'
  );

  // Metrics
  metrics: { title: string, value: string, subtext: string, icon: string }[] = [];

  roleOptions = [
    { label: 'Role ทั้งหมด', value: null },
    { label: 'Super Admin', value: 'Super Admin' },
    { label: 'Staff (พนักงาน)', value: 'Employee' },
    { label: 'Hybrid Tech (ช่างประจำ)', value: 'Hybrid Tech' },
    { label: 'Consultant (ที่ปรึกษา)', value: 'Consultant' },
    { label: 'Security (รปภ.)', value: 'Security' },
    { label: 'Technician (ช่างรายครั้ง)', value: 'Technician' },
    { label: 'Guest', value: 'Guest' },
    { label: 'User', value: 'User' },
    { label: 'Visitor', value: 'Visitor' }
  ];


  // Data
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  loading: boolean = false;
  rowsPerPageOptions: number[] = [10, 20, 50];
  imageErrors: Set<string> = new Set();

  // Edit User State
  displayEditDialog: boolean = false;
  editingUser: User | null = null;
  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Blacklist', value: 'Blacklist' }
  ];

  constructor(
    private userManagementService: UserManagementService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    this.loading = true; // Start loading

    // Authenticate (using hardcoded credentials as per existing Dashboard pattern)
    const { data: { session } } = await this.supabase.auth.getSession();

    if (!session) {
      await this.supabase.auth.signInWithPassword({
        email: 'test@test.com',
        password: '12345678'
      });
    }

    this.loadData();
  }

  async loadData() {
    const { data: { session } } = await this.supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      console.error('No session token available');
      this.loading = false;
      return;
    }

    this.userManagementService.getProfiles(token).subscribe({
      next: async (response: UserManagementResponse) => {
        // Map Metrics
        if (response.metrics) {
          this.metrics = response.metrics.map(m => {
            let icon = 'pi pi-info-circle';
            if (m.title.includes('ทั้งหมด')) icon = 'pi pi-users';
            else if (m.title.includes('ผู้ดูแลระบบ') || m.title.includes('Admin')) icon = 'pi pi-shield';
            else if (m.title.includes('ทั่วไป') || m.title.includes('User')) icon = 'pi pi-user';

            return {
              title: m.title,
              value: m.value,
              subtext: m.subtext,
              icon: icon
            };
          });
        }

        // Fetch Active Blacklist Records
        const { data: blacklist, error: blError } = await this.supabase
          .from('blacklist_records')
          .select('identifier_value, entity_id')
          .eq('entity_type', 'user')
          .eq('status', 'active');

        const blacklistedIds = new Set((blacklist || []).map(b => b.entity_id || b.identifier_value));

        // Map Users
        if (response.profiles) {
          this.allUsers = response.profiles.map(p => {
            // Split name into firstName and lastName if possible
            const nameParts = (p.name || '').trim().split(' ');
            const fName = nameParts[0] || '';
            const lName = nameParts.slice(1).join(' ') || '';

            return {
              id: p.id,
              firstName: fName,
              lastName: lName,
              phone: p.phone || '',
              email: p.email || '',
              company: p.company || '', 
              category: this.mapRoleToCategory(p.role || ''), 
              role: p.role || '',
              authMethod: '', 
              status: blacklistedIds.has(p.id) ? 'Blacklist' : 'Active', // Set status based on blacklist table
              lastActive: '', 
              registerDate: this.parseDate(p.joined_date || p.created_at) || '',
              expiryDate: null,
              avatarUrl: p.avatar
            };
          });
          this.updateFilteredUsers();
        }
        this.loading = false; // Stop loading
      },
      error: (err: any) => {
        console.error('Error fetching user profiles:', err);
        this.loading = false; // Stop loading
      }
    });
  }

  // Filter Logic
  updateFilteredUsers() {
    let users = this.allUsers;

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      users = users.filter(user => 
        (user.firstName + ' ' + user.lastName).toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.id.toLowerCase().includes(term)
      );
    }

    this.filteredUsers = [...users];
  }

  onSearch() {
    this.first = 0;
    this.updateFilteredUsers();
  }

  private mapRoleToCategory(role: string): 'Internal' | 'External' | 'Hybrid' | '' {
    switch (role) {
      case 'Super Admin':
      case 'Admin':
      case 'Employee':
      case 'Security':
        return 'Internal';
      case 'Hybrid Tech':
      case 'Consultant':
        return 'Hybrid';
      case 'Guest':
      case 'Visitor':
      case 'User':
      case 'Technician':
        return 'External';
      default:
        return 'External';
    }
  }

  private parseDate(dateStr: any): any {
    if (!dateStr) return null;
    
    // If it's already a Date or ISO string that JS can parse
    const date = new Date(dateStr);
    if (!isNaN(date.getTime()) && !dateStr.toString().includes('/')) {
      return date;
    }

    // Handle DD/MM/YYYY format (potentially Buddhist Era)
    if (typeof dateStr === 'string' && dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        let year = parseInt(parts[2], 10);

        // If year is Buddhist Era (> 2400)
        if (year > 2400) {
          year -= 543;
        }

        const newDate = new Date(year, month, day);
        return isNaN(newDate.getTime()) ? dateStr : newDate;
      }
    }

    return dateStr;
  }



  // Helper: Role Color
  getRoleSeverity(role: string): any {
    switch (role) {
      case 'Super Admin':
      case 'Admin': return 'primary';
      case 'Security': return 'contrast';
      case 'Employee': return 'info';
      case 'User': return 'info';

      // Hybrid Roles: Return undefined to use custom CSS
      case 'Hybrid Tech':
      case 'Consultant': return undefined;

      case 'Technician':
      case 'Contractor': return 'warning';
      case 'Messenger': return 'secondary';
      case 'Guest':
      case 'Visitor': return 'success';
      default: return 'secondary';
    }
  }

  // Helper: Auth Icon
  getAuthIcon(method: string): string {
    if (!method) return '';
    if (method.includes('Kiosk')) return 'pi pi-desktop';
    if (method.includes('Line OA') || method === 'System' || method.includes('App')) return 'pi pi-mobile';
    if (method === 'Face Scan') return 'pi pi-face-smile';
    if (method.includes('ID Exchange') || method.includes('Card')) return 'pi pi-id-card';
    return 'pi pi-cog';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active': return 'text-green-600 font-bold';
      case 'Checked In': return 'text-blue-600 font-bold';
      case 'Checked Out': return 'text-gray-500';
      case 'Pending': return 'text-orange-500 font-bold';
      case 'Blacklist': return 'text-red-600 font-bold line-through';
      default: return 'text-gray-700';
    }
  }

  getInitials(user: any): string {
    return UserUtils.getInitials(`${user.firstName} ${user.lastName}`);
  }

  getAvatarStyle(user: any): any {
    if (user.avatarUrl && !this.imageErrors.has(user.avatarUrl)) return {};
    return {
      'background-color': UserUtils.getAvatarColor(`${user.firstName} ${user.lastName}`),
      'color': '#ffffff'
    };
  }

  handleImageError(avatarUrl: string) {
    if (avatarUrl) {
      this.imageErrors.add(avatarUrl);
    }
  }

  getBlacklistSeverity(status: string): any {
    return status === 'Blacklist' ? 'success' : 'warn';
  }

  isExpired(dateString: string | null): boolean {
    if (!dateString) return false;
    const exp = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return exp < today;
  }

  // --- New Actions ---

  // --- New Actions ---


  toggleBlacklist(user: User) {
    const isCurrentlyBlacklisted = user.status === 'Blacklist';
    const action = isCurrentlyBlacklisted ? 'Unblock' : 'Blacklist';
    const color = isCurrentlyBlacklisted ? 'success' : 'danger';

    this.confirmationService.confirm({
      message: `คุณแน่ใจหรือไม่ว่าต้องการ ${isCurrentlyBlacklisted ? 'ปลดบล็อก' : 'ระงับการใช้งาน (Blacklist)'} ผู้ใช้นี้?`,
      header: 'ยืนยันรายการ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'ยืนยัน',
      rejectLabel: 'ยกเลิก',
      acceptButtonStyleClass: `p-button-${color} p-button-sm`,
      rejectButtonStyleClass: 'p-button-text p-button-secondary p-button-sm',
      accept: async () => {
        this.loading = true;
        try {
          const newStatus = isCurrentlyBlacklisted ? 'Active' : 'Blacklist';

          if (newStatus === 'Blacklist') {
            // 1. Add record to blacklist_records
            const { error: blError } = await this.supabase
              .from('blacklist_records')
              .insert({
                entity_type: 'user', // lowercase as per user feedback
                identifier_value: user.id, // Using profile_id as identifier_value
                entity_id: user.id,
                reason: 'ระงับการใช้งานโดยผู้ดูแลระบบ (Customer Management)',
                status: 'active'
              });
            
            if (blError) throw blError;
          } else {
            // 2. Update record in blacklist_records to inactive
            const { error: blError } = await this.supabase
              .from('blacklist_records')
              .update({ status: 'inactive', updated_at: new Date().toISOString() })
              .eq('identifier_value', user.id)
              .eq('entity_type', 'user')
              .eq('status', 'active');
            
            if (blError) throw blError;
          }

          // Note: Profiles table has no 'status' column, so we ONLY update local state
          const index = this.allUsers.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.allUsers[index].status = newStatus;
            this.allUsers = [...this.allUsers];
            this.messageService.add({
              severity: isCurrentlyBlacklisted ? 'info' : 'warn',
              summary: isCurrentlyBlacklisted ? 'ปลดบล็อกแล้ว' : 'ระงับการใช้งานแล้ว',
              detail: `${user.firstName} ${user.lastName} ถูก${isCurrentlyBlacklisted ? 'ปลดบล็อก' : 'เพิ่มในรายชื่อ Blacklist'} เรียบร้อยแล้ว`
            });
          }
        } catch (error: any) {
          console.error('Error toggling blacklist:', error);
          this.messageService.add({ severity: 'error', summary: 'ข้อผิดพลาด', detail: 'ไม่สามารถดำเนินการได้: ' + (error.message || error) });
        } finally {
          this.loading = false;
        }
      }
    });
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลผู้ใช้ ${user.firstName} ${user.lastName}? การดำเนินการนี้ไม่สามารถย้อนกลับได้`,
      header: 'ยืนยันการลบ',
      icon: 'pi pi-trash',
      acceptLabel: 'ลบข้อมูล',
      rejectLabel: 'ยกเลิก',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      rejectButtonStyleClass: 'p-button-text p-button-secondary p-button-sm',
      accept: async () => {
        this.loading = true;
        try {
          const { error } = await this.supabase
            .from('profiles')
            .delete()
            .eq('id', user.id);

          if (error) throw error;

          this.allUsers = this.allUsers.filter(u => u.id !== user.id);
          this.messageService.add({ severity: 'success', summary: 'ลบสำเร็จ', detail: 'ลบข้อมูลผู้ใช้เรียบร้อยแล้ว' });
        } catch (error: any) {
          console.error('Error deleting user:', error);
          this.messageService.add({ severity: 'error', summary: 'ข้อผิดพลาด', detail: 'ไม่สามารถลบข้อมูลได้: ' + (error.message || error) });
        } finally {
          this.loading = false;
        }
      }
    });
  }

  editUser(user: User) {
    this.editingUser = { ...user };
    this.displayEditDialog = true;
  }

  async saveUser(updatedUser: User) {
    this.loading = true;
    try {
      const { error } = await this.supabase
        .from('profiles')
        .update({
          name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
          phone: updatedUser.phone,
          email: updatedUser.email,
          role: updatedUser.role
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      const index = this.allUsers.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        this.allUsers[index] = { ...updatedUser };
        this.updateFilteredUsers();
      }

      this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'บันทึกข้อมูลผู้ใช้เรียบร้อยแล้ว' });
      this.displayEditDialog = false;
    } catch (error: any) {
      console.error('Error saving user:', error);
      this.messageService.add({ severity: 'error', summary: 'ข้อผิดพลาด', detail: 'ไม่สามารถบันทึกข้อมูลได้: ' + (error.message || error) });
    } finally {
      this.loading = false;
    }
  }

  onAdd() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'out of scope' });
  }
}