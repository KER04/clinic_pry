import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsGetall } from './forms-getall';

describe('FormsGetall', () => {
  let component: FormsGetall;
  let fixture: ComponentFixture<FormsGetall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsGetall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsGetall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
