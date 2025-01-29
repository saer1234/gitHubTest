import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddqanutityComponent } from './addqanutity.component';

describe('AddqanutityComponent', () => {
  let component: AddqanutityComponent;
  let fixture: ComponentFixture<AddqanutityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddqanutityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddqanutityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
