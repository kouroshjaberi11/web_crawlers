import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {}

  signOut() {
    this.api.signOut().subscribe({
      next: () => {
        this.router.navigate(['/sign-in']);
      },
      error: (err) => {},
    });
  }
}
