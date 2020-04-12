import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUsernameInputComponent } from './dialog-username-input.component';

describe('DialogUsernameInputComponent', () => {
  let component: DialogUsernameInputComponent;
  let fixture: ComponentFixture<DialogUsernameInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUsernameInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUsernameInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
