import { Component, OnInit } from '@angular/core';
import {LimitService} from '../../../common/services/limit.service';

@Component({
  selector: 'app-limit-router',
  templateUrl: './limit-router.component.html',
  styleUrls: ['./limit-router.component.css']
})
export class LimitRouterComponent implements OnInit {
  public selectedRouter: string[] = [];
  constructor(
    public limitService: LimitService
  ) { }

  ngOnInit() {
    this.uploadRouterData();
  }
  public uploadRouterData(): void {}
  public addRoleWindow(): void {}
}
