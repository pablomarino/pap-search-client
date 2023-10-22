import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ElasticService {

  constructor(private http: HttpClient) { }

  search(query: any) {
    const elasticsearchUrl = 'http://localhost:9200/';
    const index = 'pap';
    //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //const options = { headers: headers, body: query };
    //const options = query;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //'Access-Control-Allow-Origin': '*', // Set the allowed origin
        //'Access-Control-Allow-Headers': 'Content-Type',
        //'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        //'Access-Control-Allow-Credentials': 'true'
      }),
    };
    let response = this.http.post(elasticsearchUrl + index +'/_search?size=50&pretty=true', query, httpOptions);
    return response
  }
}
