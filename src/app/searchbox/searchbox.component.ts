import { Component } from '@angular/core';
import { ElasticService } from '../elastic.service';
import { NgFor } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { timer, throwError } from 'rxjs';

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

  search_result_error: boolean = false;
  search_result_success: boolean = false;
  search_error_message: string = "No se han encontrado resultados para la búsqueda realizada."
  search_success_message: string = "";// = "Se han encontrado {{}} resultados para la búsqueda realizada."

  pagedResults: any[] | undefined; // Results for the current page
  currentPage: number = 1;
  itemsPerPage: number = 10; // Number of items per page
  pagesArray: number[] | undefined;

  search_filters = ["Disposiciones generales", "Autoridades y personal", "Ceses", "Nombramientos", "Sustituciones", "Otras disposiciones", "Oposiciones y concursos", "Administración de justicia", "Anuncios", "Administración autonómica", "Administración local", "Otros anuncios"]

  constructor(private elasticService: ElasticService) { }

  search(formData: any) {
    console.log('Realizando búsqueda con los siguientes parámetros:', formData.searchTerm, formData.documentType);

    this.loading = true;
    this.search_result_error = false;
    this.search_result_success = false;

    this.query = { "query": { "match": { "announcement_summary": formData.searchTerm } } }

    this.elasticService.search(this.query)
      .pipe(
        catchError((error: any) => {
          this.loading = false;
          this.search_result_error = true;
          this.search_result_success = false;
          timer(2000).subscribe(() => {
            this.search_result_error = false;
          });
          console.error("Error occurred:", error);
          return throwError("An error occurred while searching.");
        })
      ).subscribe((data: any) => {
        this.loading = false;
        this.results = data.hits.hits;
        this.search_result_error = false;
        this.search_result_success = true;
        if (this.results.length == 0) {
          this.search_success_message = `No se han encontrado resultados para la búsqueda realizada.`;
        } else {
          this.search_success_message = `Se han encontrado ${this.results.length} resultados para la búsqueda realizada.`;
        }
        /*setTimeout(() => {
          this.search_result_success = false;
        }, 5000);*/
        timer(2000).subscribe(() => {
          this.search_result_success = false;
        });
        this.updatePagedResults();
        console.log("RESULTADOS: ", this.results);
      });
  }

  // Calculate the total number of pages based on the number of items and items per page
  get totalPages(): number {
    return Math.ceil(this.results.length / this.itemsPerPage);
  }

  // Generate an array of page numbers for the pagination links
  get pages(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  // Update the pagedResults array based on the current page
  updatePagedResults(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedResults = this.results.slice(startIndex, endIndex);
  }

  // Change the current page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedResults();
    }
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
