import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescrizioneServizioComponent } from './descrizione-servizio.component';

describe('DescrizioneServizioComponent', () => {
  let component: DescrizioneServizioComponent;
  let fixture: ComponentFixture<DescrizioneServizioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescrizioneServizioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DescrizioneServizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
