import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {
  quotes = [
    {
      text: "No one has ever become poor by giving.",
      author: "Anne Frank"
    },
    {
      text: "The best way to find yourself is to lose yourself in the service of others.",
      author: "Mahatma Gandhi"
    },
    {
      text: "We make a living by what we get, but we make a life by what we give.",
      author: "Winston Churchill"
    },
    {
      text: "Food is the thread that weaves communities together.",
      author: "José Andrés"
    },
    {
      text: "Sharing food with another human being is an intimate act that should not be indulged in lightly.",
      author: "M.F.K. Fisher"
    }
  ];

  currentQuoteIndex = 0;
  isQuoteVisible = false;
  private quoteInterval: any;

  ngOnInit() {
    this.startQuoteAnimation();
  }

  ngOnDestroy() {
    if (this.quoteInterval) {
      clearInterval(this.quoteInterval);
    }
  }

  startQuoteAnimation() {
    // Show first quote after initial delay
    setTimeout(() => {
      this.isQuoteVisible = true;
    }, 2000);

    // Cycle through quotes every 4 seconds
    this.quoteInterval = setInterval(() => {
      // Fade out current quote
      this.isQuoteVisible = false;
      
      // After fade out, change quote and fade in
      setTimeout(() => {
        this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
        this.isQuoteVisible = true;
      }, 500);
    }, 4000);
  }

  get currentQuote() {
    return this.quotes[this.currentQuoteIndex];
  }
}
