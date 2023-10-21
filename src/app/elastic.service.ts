import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ElasticService {

  constructor(private http: HttpClient) { }

  search(query: any) {
    const elasticsearchUrl = 'http://localhost:9200/';
    const index = 'doga';
    //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //const options = { headers: headers, body: query };

    const options = query;

    let response = this.http.post(elasticsearchUrl + index +'/_search?size=50&pretty=true', options);
    return response
  }
}
