// app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel'; // ✅ 1. Import OverlayPanel
import { PrimeNG } from 'primeng/config';
import { SiteStateService } from './service/site/site-state.service';
import { SiteApiService } from './service/site/site-api.service';
import { createClient } from '@supabase/supabase-js';
// Services
import { ModalService } from './service/modal.service';
import { filter } from 'rxjs/operators';
import { MenuModule } from 'primeng/menu';
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from './service/auth.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { UserUtils } from './utils/user-utils';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    AvatarModule,
    DividerModule,
    DynamicDialogModule,
    RippleModule,
    SidebarModule,
    ButtonModule,
    DropdownModule,
    TooltipModule,
    TooltipModule,
    OverlayPanelModule, // ✅ 2. Add to imports array
    MenuModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    ProfileFormComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'PrimeNG Admin';
  activeRoute: string = '';
  sidebarVisible: boolean = false;

  currentUserProfile = {
    firstName: 'Admin',
    lastName: 'FastPass',
    email: 'admin@fastpass.com',
    role: 'Super Admin',
    status: 'Active',
    phone: '081-234-5678',
    image: '', 
    imageError: false
  };

  siteOptions: any[] = [
    { label: 'All Sites (ภาพรวม)', value: 'all' },
    { label: 'KMITL', value: 'kmitl' },
    { label: 'KMITL2', value: 'kmitl2' },
    { label: 'KMUTT', value: 'kmutt' },
    { label: 'KMUTT2', value: 'kmutt2' }
  ];

  roleOptions = [
    { label: 'Super Admin', value: 'Super Admin' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Check Admin', value: 'Check Admin' },
    { label: 'Invite Admin', value: 'Invite Admin' },
    { label: 'Employee', value: 'Employee' },
    { label: 'User', value: 'User' }
  ];

  topMenu: any[] = [];

  supabase = createClient(
    'https://unxcjdypaxxztywplqdv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVueGNqZHlwYXh4enR5d3BscWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTA1NTQsImV4cCI6MjA3NzMyNjU1NH0.vf6ox-MLQsyzQgPCF9t6t_yPbcoMhJJNkJd1A-mS7WA'
  );

  profileMenuItems: MenuItem[] = [];
  myAccountVisible: boolean = false;
  tempProfile: any = {};

  constructor(
    public router: Router,
    private modalService: ModalService,
    private primeng: PrimeNG,
    private siteStateService: SiteStateService,  // 👈 เพิ่ม
    private siteApi: SiteApiService,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
        this.sidebarVisible = false;
      });
  }

  get selectedSite(): string {
    return this.siteStateService.getCurrentSite();
  }

  set selectedSite(value: string) {
    this.siteStateService.setSite(value);
  }

  async ngOnInit() {
    this.siteStateService.init();
    this.primeng.ripple.set(true);
    // 🔐 เช็คก่อนว่ามี session อยู่ไหม
    let { data } = await this.supabase.auth.getSession();

    if (!data.session) {
      // ถ้าไม่มีค่อย login
      const { error } = await this.supabase.auth.signInWithPassword({
        email: 'test@test.com',
        password: '12345678'
      });

      if (error) {
        console.error('Login failed:', error.message);
        return;
      }

      const sessionResult = await this.supabase.auth.getSession();
      data = sessionResult.data;
    }
    const token = data.session?.access_token;

    if (token) {
      this.siteApi.getSites(token).subscribe(res => {
        this.siteOptions = [
          { label: 'All Sites (ภาพรวม)', value: 'all' },
          ...res.sites.map((s: any) => ({
            label: s.name,
            value: String(s.id)   // ⭐ สำคัญ
          }))
        ];
      });
    }

    // Sync Profile with Mock Data/AuthService
    this.syncProfileWithAuth();


    this.topMenu = [
      { label: 'หน้าหลัก', icon: 'pi pi-home', route: '/dashboard' },
      { label: 'อาคาร', icon: 'pi pi-building', route: '/buildings' },
      { label: 'จัดการการจอง', icon: 'pi pi-th-large', route: '/reserve' },
      { label: 'จัดการผู้ใช้งาน', icon: 'pi pi-user', route: '/customer' },
      { label: 'สิทธิ์การใช้งาน', icon: 'pi pi-shield', route: '/permissions', roles: ['admin', 'super_admin'] },
    ];

    this.profileMenuItems = [
      {
        label: 'My Account',
        icon: 'pi pi-user',
        command: () => {
          this.openMyAccount();
        }
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.confirmLogout();
        }
      }
    ];

    this.modalService.initListener();
  }

  ngOnDestroy() {
    this.modalService.ngOnDestroy();
  }

  isActive(path: string): boolean {
    return this.activeRoute === path || this.router.url === path;
  }

  get isStandaloneLayout(): boolean {
    return this.activeRoute.startsWith('/login') || this.activeRoute.startsWith('/forgot-password');
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  // ✅ 3. Helper to get Current Site Label for Tooltip
  get currentSiteLabel(): string {
    const site = this.siteOptions.find(s => s.value === this.selectedSite);
    return site ? site.label : 'Select Site';
  }

  confirmLogout() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to log out?',
      header: 'Confirm Logout',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.logout().subscribe(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }

  // ✅ Returns true if menu item has no role restriction, or user has required role
  canSeeMenuItem(item: any): boolean {
    if (!item.roles || item.roles.length === 0) return true;
    return this.authService.hasRole(item.roles);
  }

  getInitials(name: string): string {
    return UserUtils.getInitials(name);
  }

  getAvatarStyle(name: string): any {
    return {
      'background-color': UserUtils.getAvatarColor(name),
      'color': '#ffffff'
    };
  }

  handleImageError() {
    this.currentUserProfile.imageError = true;
  }

  private syncProfileWithAuth() {
    const user = this.authService.getCurrentUser();
    if (user) {
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      this.currentUserProfile = {
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        role: this.formatRole(user.role),
        status: 'Active',
        phone: '081-234-5678', // Default for mock if not in object
        image: '',
        imageError: false
      };
    }
  }

  private formatRole(role: string): string {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'user': return 'User';
      default: return role;
    }
  }

  openMyAccount() {
    // Re-sync just in case it changed
    this.syncProfileWithAuth();
    this.tempProfile = { ...this.currentUserProfile };
    this.myAccountVisible = true;
  }

  saveProfile() {
    this.currentUserProfile = { ...this.tempProfile };
    this.myAccountVisible = false;
  }
}