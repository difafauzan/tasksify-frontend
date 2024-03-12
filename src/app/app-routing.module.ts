import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componets/login/login.component';
import { SignupComponent } from './componets/signup/signup.component';
import { KanbanComponent } from './kanban/kanban.component';
import { BoardComponent } from './componets/board/board.component';
import { VerifyEmailComponent } from './componets/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './componets/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './componets/reset-password/reset-password.component';
import { AuthGuard } from './shared/auth.guard';
import { SidebarComponent } from './componets/sidebar/sidebar.component';
import { NavbarComponent } from './componets/navbar/navbar.component';
import { NotFoundComponent } from './componets/not-found/not-found.component';
import { HeaderComponent } from './componets/header/header.component';
import { HomeComponent } from './componets/home/home.component';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'verify-email/:token', component: VerifyEmailComponent },

  // Feature
  { path: 'home', component: HomeComponent },
  {
    path: 'board',
    component: BoardComponent,
    canActivate: [AuthGuard],
    // children: [
    //   {
    //     path: ':id',
    //     component: KanbanComponent,
    //   },
    // ],
  },
  {
    path: 'kanban/:id',
    component: KanbanComponent,
    children: [
      {
        path: ':list_id',
        component: KanbanComponent,
      },
    ],
  },
  // Style component
  { path: 'sidebar', component: SidebarComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'header', component: HeaderComponent },
  // { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
