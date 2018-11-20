import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-s-button',
  templateUrl: './s-button.component.html',
  styleUrls: ['./s-button.component.css']
})
export class SButtonComponent implements OnInit {
  @Output() public clickEvent = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  public addClick(): void {
    this.clickEvent.emit();
  }
}
