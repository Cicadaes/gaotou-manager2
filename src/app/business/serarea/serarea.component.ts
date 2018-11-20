import { Component, OnInit } from '@angular/core';
import {Role} from '../../common/model/limit-model';

@Component({
  selector: 'app-serarea',
  templateUrl: './serarea.component.html',
  styleUrls: ['./serarea.component.css']
})
export class SerareaComponent implements OnInit {
  public serareas: Role[];
  constructor() { }

  ngOnInit() {
  }
  public addSerAreaWindow(): void {}

}
