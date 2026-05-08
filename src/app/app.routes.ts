// app.routes
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatComponent } from './chat/chat.component';
import { InboxComponent } from './inbox/inbox.component';
import { InboxListComponent } from './inbox/inboxlist/inboxlist.component'; // Import the subcomponent
import { CustomerComponent } from './customer/customer.component';
import { CardComponent } from './card/card.component';
import { VideoComponent } from './video/video.component';
import { StarComponent } from './inbox/star/star.component';
import { FloorPlanViewerComponent } from './floor-plan-viewer.componentfloor-plan-viewer/floor-plan-viewer/floor-plan-viewer.component';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  {
    path: 'buildings',
    component: InboxComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: InboxListComponent },      // <-- default child route
      { path: 'list', component: InboxListComponent },
      { path: 'star', component: StarComponent }
    ]
  },
  {
    path: 'zones',
    component: InboxComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: InboxListComponent },
      { path: 'list', component: InboxListComponent },
      { path: 'star', component: StarComponent }
    ]
  },
  { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard] },
  { path: 'reserve', component: CardComponent, canActivate: [AuthGuard] },
  { path: 'video', component: VideoComponent, canActivate: [AuthGuard] },
  { path: 'fp', component: FloorPlanViewerComponent, canActivate: [AuthGuard] }
];

