import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { STableComponent } from './components/s-table/s-table.component';
import { SButtonComponent } from './components/s-button/s-button.component';
import { SLoationComponent } from './components/s-loation/s-loation.component';
@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [STableComponent, SButtonComponent, SLoationComponent],
  exports: [
    SButtonComponent,
    SLoationComponent
  ],
  providers: [],
})
export class SharedModule { }
