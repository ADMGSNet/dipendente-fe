import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { faFacebookF, faXTwitter, faLinkedinIn, faWhatsapp, faTelegramPlane, faYoutube, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-footer',
    imports: [FontAwesomeModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    standalone: true

})
export class FooterComponent implements OnInit, OnDestroy{

 
  faFacebookF = faFacebookF;
  faXTwitter = faXTwitter;
  faLinkedinIn = faLinkedinIn;
  faWhatsapp = faWhatsapp;
  faTelegramPlane = faTelegramPlane;
  faYoutube = faYoutube
  faInstagram = faInstagram
  faTiktok = faTiktok
  
  showButton = false; 
  private scrollSubscription?: Subscription;

  isBrowser: boolean;


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // console.log("TTT", this.isBrowser)
    // if (this.isBrowser) {
    //   window.alert("ollk")
    // }

    
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.scrollSubscription = fromEvent(window, 'scroll') .subscribe(() => {
        this.showButton = window.pageYOffset >= 100; 
      })
    }
  }
  ngOnDestroy() {
  if(this.scrollSubscription){
    this.scrollSubscription.unsubscribe();
  }

  } 
  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
