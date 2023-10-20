import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ElasticService {

  private elasticsearchUrl = 'http://localhost:9200/';

  constructor(private http: HttpClient) { }

  search(query: any) {

  /*
  const elasticQuery = {
        "query": {
          "range": {
            "document_page": {
                      "gte": 55170,
                      "lte": 55370
                  }
          }
        }
    };
    */
    console.log("QUERY -------> ",query)
    let response =  this.http.get(this.elasticsearchUrl + 'doga/_search', query);
    return response
  }

}
