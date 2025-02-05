import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faXTwitter, faLinkedinIn, faWhatsapp, faTelegramPlane } from '@fortawesome/free-brands-svg-icons';

@Component({
    selector: 'app-social-button',
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './social-button.component.html',
    styleUrl: './social-button.component.scss',
    standalone: true

})
export class SocialButtonComponent {

  faTimes = faTimes
  faFacebookF = faFacebookF;
  faXTwitter = faXTwitter;
  faLinkedinIn = faLinkedinIn;
  faWhatsapp = faWhatsapp;
  faTelegramPlane = faTelegramPlane;
  faShareNodes = faShareNodes;

  showSocialButton = true;

  toggleSocialButton() {
    this.showSocialButton = !this.showSocialButton;
  }

}
