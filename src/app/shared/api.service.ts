import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private cookies: CookieService) {}

  getUsers() {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };

    return this.http.get('http://192.168.50.92:3000/user', options).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  // Api Board
  postBoard(data: any) {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };
    // console.log(data);
    return this.http
      .post('http://192.168.50.92:3000/board/create', data, options)
      .pipe(
        map((response: any) => {
          // console.log(data);
          return response;
        })
      );
  }

  getBoard(userId: number) {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };

    let data = { userId: userId };
    return this.http.post('http://192.168.50.92:3000/board', data, options).pipe(
      map((response: any) => {
        // console.log(response);
        return response;
      })
    );
  }

  getBoardById(id: any) {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };

    return this.http
      .get<any>('http://192.168.50.92:3000/board/' + id, options)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  updateBoard(data: any, id: any) {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };

    return this.http
      .patch<any>('http://192.168.50.92:3000/board/' + id, data, options)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  deleteBoard(id: any) {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };

    return this.http
      .delete<any>('http://192.168.50.92:3000/board/' + id, options)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  // end board api
  // Start API list
  postList(data: any) {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };

    return this.http.post('http://192.168.50.92:3000/list', data, options).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getList() {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };
    return this.http.get<any>('http://192.168.50.92:3000/list', options).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateList(data: any, id: any) {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };
    return this.http
      .patch<any>('http://192.168.50.92:3000/list/' + id, data, options)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  deleteList(id: any) {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };
    return this.http
      .delete<any>('http://192.168.50.92:3000/list/' + id, options)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  // End List API
  // start tasks API
  postTask(data: any) {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };
    return this.http
      .post('http://192.168.50.92:3000/task/create', data, options)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getTask() {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };
    return this.http.get<any>('http://192.168.50.92:3000/task', options).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateTask(data: any, id: any) {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };
    console.log(data, id);
    return this.http
      .put<any>('http://192.168.50.92:3000/task/' + id, data, options)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  deleteTask(id: any) {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };
    return this.http
      .delete<any>('http://192.168.50.92:3000/task/' + id, options)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  addColab(data: any) {
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };

    return this.http
      .post<any>(
        'http://192.168.50.92:3000/board-members/add-member/',
        data,
        options
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  // end tasks API

  removeMember(data: any){
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };

    return this.http
      .post<any>(
        'http://192.168.50.92:3000/board-members/remove-member/',
        data,
        options
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
