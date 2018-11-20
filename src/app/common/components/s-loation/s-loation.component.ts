import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-s-loation',
  templateUrl: './s-loation.component.html',
  styleUrls: ['./s-loation.component.css']
})
export class SLoationComponent implements OnInit {
  @Input() public locationTitle: string;
  constructor(
    private router: Router,
    public routeInfo: ActivatedRoute
  ) { }

  ngOnInit() {}

}
