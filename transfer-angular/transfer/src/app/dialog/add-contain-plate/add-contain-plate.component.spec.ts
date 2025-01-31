import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContainPlateComponent } from './add-contain-plate.component';

describe('AddContainPlateComponent', () => {
  let component: AddContainPlateComponent;
  let fixture: ComponentFixture<AddContainPlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContainPlateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContainPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
