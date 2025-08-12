import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Donation, DonationService } from '../../services/donation.service';

@Component({
  selector: 'app-donation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './donation-detail.html',
  styleUrl: './donation-detail.scss'
})
export class DonationDetailComponent {
  donation?: Donation;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donationService: DonationService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadDonation(id);
  }

  private loadDonation(id: string) {
    this.isLoading = true;
    this.donationService.getById(id).subscribe({
      next: (donation) => {
        this.donation = donation;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading donation:', error);
        this.router.navigate(['/donations']);
      }
    });
  }

  setStatus(status: Donation['status']) {
    if (!this.donation) return;
    
    this.donationService.updateStatus(this.donation.id, status).subscribe({
      next: (updatedDonation) => {
        this.donation = updatedDonation;
      },
      error: (error) => {
        console.error('Error updating donation status:', error);
        // TODO: Show user-friendly error message
      }
    });
  }

  delete() {
    if (!this.donation) return;
    if (!confirm('Are you sure you want to delete this donation?')) return;
    
    this.donationService.remove(this.donation.id).subscribe({
      next: () => {
        this.router.navigate(['/donations']);
      },
      error: (error) => {
        console.error('Error deleting donation:', error);
        // TODO: Show user-friendly error message
      }
    });
  }
} 