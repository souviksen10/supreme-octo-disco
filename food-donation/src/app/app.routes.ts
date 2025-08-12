import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'donate', loadComponent: () => import('./pages/donate/donate').then(m => m.DonateComponent) },
  { path: 'donations', loadComponent: () => import('./pages/donations/donations').then(m => m.DonationsComponent) },
  { path: 'donations/:id/edit', loadComponent: () => import('./pages/edit-donation/edit-donation').then(m => m.EditDonationComponent) },
  { path: 'donations/:id', loadComponent: () => import('./pages/donation-detail/donation-detail').then(m => m.DonationDetailComponent) },
  { path: '**', redirectTo: '' }
];
