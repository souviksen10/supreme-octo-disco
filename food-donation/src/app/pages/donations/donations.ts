import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Donation, DonationService } from '../../services/donation.service';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './donations.html',
  styleUrl: './donations.scss'
})
export class DonationsComponent {
  donations: Donation[] = [];
  allDonations: Donation[] = [];
  filteredDonations: Donation[] = [];
  isLoading = false;
  
  // Search properties
  searchTerm = '';
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 0;

  constructor(private donationService: DonationService) {
    this.refresh();
  }

  refresh() {
    this.isLoading = true;
    this.donationService.getAll().subscribe({
      next: (donations) => {
        this.allDonations = donations;
        this.applySearch();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading donations:', error);
        this.isLoading = false;
        // TODO: Show user-friendly error message
      }
    });
  }

  applySearch() {
    if (!this.searchTerm.trim()) {
      this.filteredDonations = [...this.allDonations];
    } else {
      const searchLower = this.searchTerm.toLowerCase().trim();
      this.filteredDonations = this.allDonations.filter(donation =>
        donation.donorName.toLowerCase().includes(searchLower)
      );
    }
    this.currentPage = 1; // Reset to first page when searching
    this.calculatePagination();
    this.updatePageData();
  }

  onSearchChange() {
    this.applySearch();
  }

  clearSearch() {
    this.searchTerm = '';
    this.applySearch();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredDonations.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  updatePageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.donations = this.filteredDonations.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePageData();
    }
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredDonations.length);
  }

  remove(id: string) {
    if (!confirm('Are you sure you want to delete this donation?')) return;
    
    this.donationService.remove(id).subscribe({
      next: () => {
        // Remove from local array first for immediate UI update
        this.allDonations = this.allDonations.filter(d => d.id !== id);
        this.applySearch(); // This will recalculate filtered data and pagination
      },
      error: (error) => {
        console.error('Error removing donation:', error);
        // TODO: Show user-friendly error message
        // Refresh on error to ensure data consistency
        this.refresh();
      }
    });
  }
} 