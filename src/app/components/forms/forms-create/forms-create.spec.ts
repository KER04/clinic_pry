import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsCreate } from './forms-create';

describe('FormsCreate', () => {
  let component: FormsCreate;
  let fixture: ComponentFixture<FormsCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
