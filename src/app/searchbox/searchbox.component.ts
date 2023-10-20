import { Component } from '@angular/core';
import { ElasticService } from '../elastic.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent {
  query = {};
  results: any = [];
  loading: boolean = false;

  documentTypes: string[] = ["All", "BOE", "BOPA", "DOGA"];
  selectedDocumentType: string = "All";

  constructor(private elasticService: ElasticService) { }

  search(formData: any) {
    console.log('Realizando búsqueda con los siguientes parámetros:', formData.searchTerm, formData.documentType);

    this.loading = true;
    this.query =
    {
      "body": {
        "query": {
          "must": {
            "match": {
              "announcement_content": formData.searchTerm
            }
          }
        }
      }
    }

    this.elasticService.search(JSON.stringify(this.query)).subscribe((data:any) => {
      //this.elasticService.search(this.query).subscribe((data) => {
      this.loading = false;
      this.results = data.hits.hits;
    });
  }
}









    /*
    {
      "query": {
        "bool": {
              "bool": {
                "should": [
                  {
                    "match": {
                      "announcement_content": "patata"
                    }
                  },
                  {
                    "match": {
                      "announcement_summary": "patata"
                    }
                  }
                ]
              }
      }
    }
    }

    "query": {
        "multi_match": {
          "query": "tu_termino_de_busqueda",
          "fields": ["campo1", "campo2", "campo3", "campo4"]  // Lista de campos que deseas buscar
        }
      }
    */
