import { Injectable } from '@angular/core';
import { User } from '../classes/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // endpoint = 'http://localhost:3000';
  endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  signIn(username: string, password: string) {
    return this.http.post<User>(this.endpoint + '/users/signin', {
      username: username,
      password: password,
    });
  }

  signUp(username: string, password: string) {
    return this.http.post<User>(this.endpoint + '/users/signup', {
      username: username,
      password: password,
    });
  }

  signOut() {
    return this.http.get<{ message: string }>(this.endpoint + `/users/signout`);
  }

  me() {
    return this.http.get<{ userId: number; username: string }>(
      this.endpoint + `/users/me`
    );
  }
}
