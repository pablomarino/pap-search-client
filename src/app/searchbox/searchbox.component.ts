import { Component } from '@angular/core';
import { ElasticService } from '../elastic.service';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent {
  query = '';
  results: any;
  constructor(private elasticService: ElasticService) {}

  search() {
    this.elasticService.search(this.query).subscribe((data) => {
      this.results = data;
    });
  }
}
