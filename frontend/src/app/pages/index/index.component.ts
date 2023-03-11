import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * The index component is responsible for handling everything that a user can do in the home page.
 *
 * In this case, we are able to:
 * - create a new message
 * - upvote, downvote a message
 * - delete a message
 *
 * Note how this component makes all the API calls, but if you take a look at the .html.ts file, it does not
 * define at all how this page looks like. This is called a "smart component" in the "smart-dumb component" pattern.
 */
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  error: string = ''; // string representing the error message
  isAuth: boolean = false; // boolean representing if the user is authenticated
  streamForm: FormGroup;
  username: string = '';
  userId: number = 0;

  /**
   * Angular is famous for its dependency injection framework. If we want to use ApiService, we must declare it
   * in the constructor. This applies for all the non components you want to use in another component, and mostly,
   * it would be custom services you define.
   */
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.streamForm = this.fb.group({
      stream: '',
    });
  }

  ngOnInit(): void {
    this.checkAuth();
  }

  startStream() {
    this.router.navigate([`/stream/${this.username}`]);
  }

  goToStream() {
    this.router.navigate([`/view/${this.streamForm.value.stream}`]);
  }

  checkAuth() {
    this.api.me().subscribe({
      next: (res) => {
        if (res.userId) {
          this.isAuth = true;
          this.username = res.username;
          this.userId = res.userId;
        } else this.isAuth = false;
        this.error = '';
      },
      error: (err) => {
        this.error = err.error.error;
      },
    });
  }
}
