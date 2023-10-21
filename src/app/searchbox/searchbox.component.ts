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


  search_filters = ["Disposiciones generales","Autoridades y personal","Ceses","Nombramientos","Sustituciones","Otras disposiciones","Oposiciones y concursos","Administración de justicia","Anuncios","Administración autonómica","Administración local","Otros anuncios"]

  constructor(private elasticService: ElasticService) { }

  search(formData: any) {
    console.log('Realizando búsqueda con los siguientes parámetros:', formData.searchTerm, formData.documentType);

    this.loading = true;
    /*this.query =
    {
      query: {
        match: {
          announcement_content: formData.searchTerm
        }
      }
    }*/

    this.query = {"query":{"match":{"announcement_summary":formData.searchTerm}}}

    /*
    this.query = {
      query: {
        bool: {
          must: [
            { match: { announcement_content: formData.searchTerm }}
          ]
        }
      }
    }
    */

    //this.elasticService.search(JSON.stringify(this.query)).subscribe((data: any) => {
      this.elasticService.search(this.query).subscribe((data:any) => {
      this.loading = false;
      this.results = data.hits.hits;
      console.log("RESULTADOS: ", this.results);
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
