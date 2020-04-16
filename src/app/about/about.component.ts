import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass']
})
export class AboutComponent implements OnInit {

  text = "I am groot... I am groot";

  constructor() { }

  ngOnInit(): void {
  }


  translateText() {
    this.text = "You only live once, but if you do it right, once is enough.";
  }
}
