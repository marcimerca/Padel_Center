import { Component } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-scegli-data',
  templateUrl: './scegli-data.component.html',
  styleUrls: ['./scegli-data.component.scss'],
})
export class ScegliDataComponent {
  model: NgbDateStruct | null = null;
}
