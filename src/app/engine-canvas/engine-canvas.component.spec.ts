import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineCanvasComponent } from './engine-canvas.component';

describe('EngineCanvasComponent', () => {
  let component: EngineCanvasComponent;
  let fixture: ComponentFixture<EngineCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
