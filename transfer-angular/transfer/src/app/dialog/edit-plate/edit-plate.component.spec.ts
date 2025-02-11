import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlateComponent } from './edit-plate.component';

describe('EditPlateComponent', () => {
  let component: EditPlateComponent;
  let fixture: ComponentFixture<EditPlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPlateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
