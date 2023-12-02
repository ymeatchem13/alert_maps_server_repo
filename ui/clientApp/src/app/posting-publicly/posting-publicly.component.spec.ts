import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingPubliclyComponent } from './posting-publicly.component';

describe('PostingPubliclyComponent', () => {
  let component: PostingPubliclyComponent;
  let fixture: ComponentFixture<PostingPubliclyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostingPubliclyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostingPubliclyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
