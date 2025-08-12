import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DonationService, Donation, DonationStatus } from '../../services/donation.service';

@Component({
  selector: 'app-edit-donation',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './edit-donation.html',
  styleUrl: './edit-donation.scss'
})
export class EditDonationComponent implements OnInit {
  model = {
    donorName: '',
    contact: '',
    foodType: '',
    quantity: 1,
    unit: 'meals',
    expiryDate: '',
    location: '',
    notes: '',
    status: 'available'
  };

  units = ['meals', 'kg', 'boxes', 'pieces', 'liters', 'portions'];
  statuses = ['available', 'reserved', 'collected'];
  isSubmitting = false;
  isLoading = true;
  donationId: string = '';
  originalDonation: Donation | null = null;

  constructor(
    private donationService: DonationService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.donationId = this.route.snapshot.params['id'];
    this.loadDonation();
  }

  loadDonation() {
    this.isLoading = true;
    this.donationService.getById(this.donationId).subscribe({
      next: (donation) => {
        this.originalDonation = donation;
        this.model = {
          donorName: donation.donorName,
          contact: donation.contact,
          foodType: donation.foodType,
          quantity: donation.quantity,
          unit: donation.unit,
          expiryDate: donation.expiryDate,
          location: donation.location,
          notes: donation.notes || '',
          status: donation.status
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading donation:', error);
        this.isLoading = false;
        // Redirect to donations list if donation not found
        this.router.navigate(['/donations']);
      }
    });
  }

  submit(form: NgForm) {
    if (!form.valid || this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    const updateData = {
      donorName: this.model.donorName.trim(),
      contact: this.model.contact.trim(),
      foodType: this.model.foodType.trim(),
      quantity: Number(this.model.quantity),
      unit: this.model.unit,
      expiryDate: this.model.expiryDate,
      location: this.model.location.trim(),
      notes: this.model.notes?.trim() || undefined,
      status: this.model.status as DonationStatus
    };

    this.donationService.update(this.donationId, updateData).subscribe({
      next: () => {
        this.router.navigate(['/donations', this.donationId]);
      },
      error: (error) => {
        console.error('Error updating donation:', error);
        this.isSubmitting = false;
        // TODO: Show user-friendly error message
      }
    });
  }

  cancel() {
    // Navigate back to donation details
    this.router.navigate(['/donations', this.donationId]);
  }

  hasChanges(): boolean {
    if (!this.originalDonation) return false;
    
    return (
      this.model.donorName.trim() !== this.originalDonation.donorName ||
      this.model.contact.trim() !== this.originalDonation.contact ||
      this.model.foodType.trim() !== this.originalDonation.foodType ||
      Number(this.model.quantity) !== this.originalDonation.quantity ||
      this.model.unit !== this.originalDonation.unit ||
      this.model.expiryDate !== this.originalDonation.expiryDate ||
      this.model.location.trim() !== this.originalDonation.location ||
      (this.model.notes?.trim() || '') !== (this.originalDonation.notes || '') ||
      this.model.status !== this.originalDonation.status
    );
  }
} 