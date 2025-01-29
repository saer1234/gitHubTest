import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovequantityComponent } from './removequantity.component';

describe('RemovequantityComponent', () => {
  let component: RemovequantityComponent;
  let fixture: ComponentFixture<RemovequantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemovequantityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemovequantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
