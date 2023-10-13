import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchboxComponent } from './searchbox/searchbox.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes), SearchboxComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }
