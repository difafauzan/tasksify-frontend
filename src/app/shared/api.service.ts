import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private response: Response,
    private cookies: CookieService
  ) {
  }
  // // api task
  // postTask(data: any) {
  //   return this.http.post<any>('http://192.168.1.19:3000/task', data).pipe(
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }
  // getTask() {
  //   return this.http.get<any>('http://192.168.1.19:3000/task').pipe(
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }
  // updateTask(data: any, id: any) {
  //   return this.http
  //     .put<any>('http://192.168.1.19:3000/task/' + id, data)
  //     .pipe(
  //       map((response: any) => {
  //         return response;
  //       })
  //     );
  // // }
  // deleteTask(id: any) {
  //   return this.http.delete<any>('http://192.168.1.19:3000/task/' + id).pipe(
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }
  // Api Board
  postBoard(data: any) {
    console.log(data);
    return this.http.post('http://192.168.1.19:3000/board/create', data).pipe(
      map((response: any) => {
        // console.log(data);
        return response;
      })
    );
  }

  getBoard(userId: number) {
    // Set access token
    let accessToken = this.cookies.get('access-token')
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+accessToken
    });
    let options = {headers: headers};
    
    let data = { userId: userId };
    return this.http.post('http://192.168.1.19:3000/board', data, options).pipe(
      map((response: any) => {
        console.log(response);
        return response;
      })
    );
  }

  getBoardById(id: any) {    // Set access token
    let accessToken = this.cookies.get('access-token')
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+accessToken
    });
    let options = {headers: headers};

    return this.http.get<any>('http://192.168.1.19:3000/board/' + id, options).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateBoard(data: any, id: any) {
    return this.http
      .patch<any>('http://192.168.1.19:3000/board/' + id, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  deleteBoard(id: any) {
    return this.http.delete<any>('http://192.168.1.19:3000/board/' + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  // end board api
  // Start API list
  postList(data: any) {
    return this.http.post('http://192.168.1.19:3000/list', data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getList() {
    return this.http.get<any>('http://192.168.1.19:3000/list').pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateList(data: any, id: any) {
    return this.http
      .patch<any>('http://192.168.1.19:3000/list/' + id, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  deleteList(id: any) {
    return this.http.delete<any>('http://192.168.1.19:3000/list/' + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  // End List API
  // start tasks API
  postTask(data: any) {
    return this.http.post('http://192.168.1.19:3000/task/create', data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getTask() {
    return this.http.get<any>('http://192.168.1.19:3000/task').pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateTask(data: any, id: any) {
    console.log(data, id);
    return this.http.put<any>('http://192.168.1.19:3000/task/' + id, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteTask(id: any) {
    return this.http.delete<any>('http://192.168.1.19:3000/task/' + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  // end tasks API
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
}
