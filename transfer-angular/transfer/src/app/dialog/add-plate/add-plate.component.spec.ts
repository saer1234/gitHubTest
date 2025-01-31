import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlateComponent } from './add-plate.component';

describe('AddPlateComponent', () => {
  let component: AddPlateComponent;
  let fixture: ComponentFixture<AddPlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPlateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
