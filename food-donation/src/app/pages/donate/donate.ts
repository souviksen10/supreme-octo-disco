import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DonationService } from '../../services/donation.service';

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './donate.html',
  styleUrl: './donate.scss'
})
export class DonateComponent {
  model = {
    donorName: '',
    contact: '',
    foodType: '',
    quantity: 1,
    unit: 'meals',
    expiryDate: '',
    location: '',
    notes: ''
  };

  units = ['meals', 'kg', 'boxes'];
  isSubmitting = false;

  constructor(private donationService: DonationService, private router: Router) {}

  submit(form: NgForm) {
    if (!form.valid || this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.donationService.add({
      donorName: this.model.donorName.trim(),
      contact: this.model.contact.trim(),
      foodType: this.model.foodType.trim(),
      quantity: Number(this.model.quantity),
      unit: this.model.unit,
      expiryDate: this.model.expiryDate,
      location: this.model.location.trim(),
      notes: this.model.notes?.trim() || undefined
    }).subscribe({
      next: () => {
        this.router.navigate(['/donations']);
      },
      error: (error) => {
        console.error('Error creating donation:', error);
        this.isSubmitting = false;
        // TODO: Show user-friendly error message
      }
    });
  }

  cancel() {
    // Reset form and navigate back
    this.resetForm();
    this.router.navigate(['/donations']);
  }

  private resetForm() {
    this.model = {
      donorName: '',
      contact: '',
      foodType: '',
      quantity: 1,
      unit: 'meals',
      expiryDate: '',
      location: '',
      notes: ''
    };
  }
} 