import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharateristicsDashboardComponent } from './charateristics-dashboard.component';

describe('CharateristicsDashboardComponent', () => {
  let component: CharateristicsDashboardComponent;
  let fixture: ComponentFixture<CharateristicsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharateristicsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharateristicsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
