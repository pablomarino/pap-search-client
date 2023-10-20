import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ElasticService {

  private elasticsearchUrl = 'http://localhost:9200/';

  constructor(private http: HttpClient) { }

  search(query: string) {
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

    let response =  this.http.post(this.elasticsearchUrl + 'doga/_search', elasticQuery);
console.log(response)
    return response
  }

}
