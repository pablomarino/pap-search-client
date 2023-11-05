import { Component } from '@angular/core';
import { ElasticService } from '../elastic.service';
import { NgFor } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { timer, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})

export class SearchboxComponent {
  query = {};
  results: any = [];
  loading: boolean = false;

  // Document select
  searchTerm: string = "";
  documentTypes: string[] = ["All", "BOE", "DOGA"];
  selectedDocumentType: string = "All";

  // Alert
  search_result_error: boolean = false;
  search_result_none: boolean = false;
  search_result_success: boolean = false;
  search_error_message: string = "Se ha producido un error al realizar la búsqueda."
  search_none_message: string = "No se han encontrado resultados para la búsqueda realizada."
  search_success_message: string = "";// = "Se han encontrado {{}} resultados para la búsqueda realizada."

  collapse_main_status: boolean = false;
  // Filter issue
  start_issue_value: number = 0;
  end_issue_value: number = 0;
  filter_issue_by_range: boolean = false;
  collapse_issue_status: boolean = false;

  // Filter DATE
  start_date_value: string = '';
  end_date_value: string = '';
  filter_date_by_range: boolean = false;
  collapse_date_status: boolean = false;

  // Filter page
  start_page_value: number = 0;
  end_page_value: number = 0;
  filter_page_by_range: boolean = false;
  collapse_page_status: boolean = false;

  // Filter Ranking
  ranking_value: number = 100;
  collapse_ranking_status: boolean = false;

  // Pagination
  pagedResults: any[] | undefined; // Results for the current page
  currentPage: number = 1;
  itemsPerPage: number = 10; // Number of items per page
  pagesArray: number[] | undefined;


  constructor(private elasticService: ElasticService) { }


  buildQuery():string {

    let searchterm_string = '';
    let searchissue_string = '';
    let searchdate_string = '';
    let searchpage_string = '';

    // Search Term
    if(this.searchTerm.trim() === '' && this.collapse_main_status && (this.collapse_issue_status || this.collapse_date_status || this.collapse_page_status)){
      // If no search term is entered, but filters are used, I use 'match_all' to filter all results
      searchterm_string = '{ "match_all": { } }';
    }else{
      searchterm_string = `{ "match": { "announcement_summary": "${this.searchTerm}" } }`
    }

    // Search Filters
    if(this.collapse_main_status){

      if(this.collapse_issue_status){
        // está activo el filtro por numero de boletin

        if(this.filter_issue_by_range){
          // se añade filtro para rango de numeros
          searchissue_string=`{ "range": { "document_number": { "gte": ${this.start_issue_value}, "lte": ${this.end_issue_value} } } },`
        }else{
          // se añade filtro para numero exacto
          searchissue_string=`{ "term": { "document_number": ${this.start_issue_value} } },`
        }
      }else{
        // no está activo el filtro por numero de boletin
        searchissue_string='';
      }

      if(this.collapse_date_status){
        // esta activo el filtro por fecha
        if(this.filter_date_by_range){
          // se añade filtro para rango de fechas
          searchdate_string=`{ "range": { "publication_date": { "gte": "${this.start_date_value}T00:00:00.000000Z", "lte": "${this.end_date_value}T00:00:00.000000Z" } } },`
        }else{
          // se añade filtro para fecha exacta
          searchdate_string=`{ "term": { "publication_date": "${this.start_date_value}T00:00:00.000000Z" } },`
        }
      }else{
        // no está activo el filtro por fecha
        searchdate_string='';
      }

      if(this.collapse_page_status){
        // esta activo el filtro por pagina
        if(this.filter_page_by_range){
          // se añade filtro para rango de paginas
          searchpage_string=`{ "range": { "document_page": { "gte": ${this.start_page_value}, "lte": ${this.end_page_value} } } },`
        }else{
          // se añade filtro para pagina exacta
          searchpage_string=`{ "term": { "document_page": ${this.start_page_value} } },`
        }
      }else{
        // no está activo el filtro por pagina
        searchpage_string='';
      }
    }



    const query: string = `{
      "query": {
        "bool": {
          "must": [
            ${searchissue_string}
            ${searchdate_string}
            ${searchpage_string}
            ${searchterm_string}
          ],
          "must_not": [],
          "should": []
        }
      },
      "from": 0,
      "size": 500,
      "sort": [],
      "aggs": {}
    }`
    return query;

    /*
    let query_start:string = `{ "query": { "match": { "announcement_summary": "${this.searchTerm}" } } ` ;
    let query_end:string = '}';

    if(this.collapse_main_status){
      query_start += ', "filter": {';
      query_end = '}'+query_end;
      if(this.collapse_issue_status){
        if(this.filter_issue_by_range){
          // se añade filtro para rango de numeros
          query_start += `"range": { "announcement_issue": { "gte": "${this.start_issue_value}", "lte": "${this.end_issue_value}" } }`;
        }else{
          // se añade filtro para numero exacto
        }
      }else if(this.collapse_date_status){
        if(this.filter_date_by_range){
          // se añade filtro para rango de fechas
        }else{
          // se añade filtro para fecha exacta

        }
      }else if(this.collapse_page_status){
        if(this.filter_page_by_range){
          // se añade filtro para rango de paginas
        }else{
          // se añade filtro para pagina exacta
        }
      }else if(this.collapse_ranking_status){
      }
    }
    return query_start+query_end;

   return `{"query":{"match_all":{}}}`;
   */
  }

  search(formData: any) {


    // loading
    this.loading = true;
    // Alerts
    this.search_result_error = false;
    this.search_result_none = false;
    this.search_result_success = false;
    // pagination
    this.currentPage = 1;


    this.searchTerm = formData.searchTerm;
    this.selectedDocumentType = formData.selectedDocumentType;

    this.query = this.buildQuery()//{ "query": { "match": { "announcement_summary": formData.searchTerm } } }

    console.log("QUERY: ", this.query);

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
        this.search_result_none = false;

        if (this.results.length == 0) {
          this.search_result_none = true;
          this.search_success_message = `No se han encontrado resultados para la búsqueda realizada.`;
        } else {
          this.search_result_success = true;
          this.search_success_message = `Se han encontrado ${this.results.length} resultados para la búsqueda realizada.`;
        }
        /*setTimeout(() => {
          this.search_result_success = false;
        }, 5000);*/
        timer(2000).subscribe(() => {
          this.search_result_none = false;
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


  check_issue_range_min(e: number){
    if(this.start_issue_value >= this.end_issue_value){
      this.end_issue_value = this.start_issue_value+1;
    }
  }
  check_date_range_min(e: string){
    if(this.start_date_value > this.end_date_value){

      let fecha = new Date(this.start_date_value);
      fecha.setDate(fecha.getDate() + 1);
      // Obtiene el día siguiente en formato "YYYY-MM-DD"
      this.end_date_value = fecha.toISOString().slice(0, 10).toString();
    }

  }
  check_page_range_min(e: number){
    if(this.start_page_value >= this.end_page_value){
      this.end_page_value = this.start_page_value+1;
    }
  }
  check_page_ranking(e:any){
    console.log(e);
  }

}
