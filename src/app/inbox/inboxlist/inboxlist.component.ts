import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';




@Component({
  selector: 'app-inbox-list',
  standalone: true,
  imports: [CommonModule, TableModule, AvatarModule, TagModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './inboxlist.component.html',
  styleUrls: ['./inboxlist.component.css']
})
export class InboxListComponent {
  first: number = 0;
  rowsPerPageOptions: number[] = [10, 20, 50];

  title: string = 'Inbox';
  buttonLabel: string = 'New Mail';

  constructor(private router: Router, private messageService: MessageService) {
    if (this.router.url.includes('/buildings')) {
      this.title = 'Buildings (อาคาร)';
      this.buttonLabel = 'เพิ่มอาคาร';
    } else if (this.router.url.includes('/zones')) {
      this.title = 'Zones (โซน)';
      this.buttonLabel = 'เพิ่มโซน';
    }
  }

 messages = [
    { subject: 'Meeting Reminder', sender: 'Alice', date: '2025-08-14', status: 'Unread' },
    { subject: 'Project Update', sender: 'Bob', date: '2025-08-13', status: 'Read' },
    { subject: 'Invoice #432', sender: 'Charlie', date: '2025-08-12', status: 'Unread' }
  ];

  getSeverity(status: string) {
    switch (status) {
      case 'Unread':
        return 'danger';
      case 'Read':
        return 'success';
      default:
        return 'info';
    }
  }

  onAdd() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'out of scope' });
  }
 }