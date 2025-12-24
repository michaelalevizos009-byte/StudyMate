import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/auth/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GeneratorComponent } from './components/generator/generator.component';
import { ResultComponent } from './components/result/result.component';
import { UpgradeComponent } from './components/payment/upgrade.component';
import { TermsComponent } from './components/legal/terms.component';
import { PrivacyComponent } from './components/legal/privacy.component';
import { PlannerComponent } from './components/planner/planner.component';
import { NotesComponent } from './components/notes/notes.component';
import { CommunityComponent } from './components/community/community.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { 
    path: 'app', 
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'planner', component: PlannerComponent },
      { path: 'notes', component: NotesComponent },
      { path: 'community', component: CommunityComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'generate', component: GeneratorComponent },
      { path: 'result/:id', component: ResultComponent },
      { path: 'upgrade', component: UpgradeComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];