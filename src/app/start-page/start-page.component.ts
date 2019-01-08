import { Component, OnInit } from '@angular/core';
import { remote } from 'electron';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {
  started: boolean
  constructor() { }

  ngOnInit() {
  }

  quit() {
    remote.getCurrentWindow().close()
  }

  start() {
    this.started = true
  }

  resetGame($event) {
    this.started = false
  }

}
