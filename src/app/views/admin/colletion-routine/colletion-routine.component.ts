import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { barrios } from 'src/app/models/barrios';
import { colletionRoutine } from 'src/app/models/colletion-routine';
import { BarriosService } from 'src/app/services/barrios.service';
import { ColletionRoutineService } from 'src/app/services/colletion-routine.service';
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-colletion-routine',
  templateUrl: './colletion-routine.component.html',
  styleUrls: ['./colletion-routine.component.css']
})
export class ColletionRoutineComponent implements OnInit {
  @Input()
  get color(): string {
    return this._color;
  }
  list: colletionRoutine[] = []
  showModal: boolean = false
  colletionRoutineForm: FormGroup;
  showBarrios = false;
  barrios: barrios[] = [];
  filteredBarrios = [...this.barrios];
  searchControl: FormControl = new FormControl();
  weekdays: string[] = []

  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";
  constructor(private fb: FormBuilder, private colletionRoutineSV: ColletionRoutineService, private barriosService: BarriosService) {
    this.colletionRoutineForm = this.fb.group({
      neighborhood: ['', Validators.required],
      startHour: ['', Validators.required],
      endHour: ['', Validators.required],
      weekdays: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.barriosService.getBarrios().subscribe(data => {
      this.barrios = data.barrios;
      this.filteredBarrios = data.barrios
    });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Agrega un retardo de 300ms al filtro para mejorar el rendimiento
        startWith('')
      )
      .subscribe(value => {
        this.filterBarrios(value);
      });

    this.getList()
  }

  getList(){
    this.list = []
    this.colletionRoutineSV.list().subscribe(response => {
      response.map(item => {
        this.list.push({ ...item, weekdays: item.weekdays.split(',') })
      })
    })
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  onSubmit() {
    this.colletionRoutineForm.get('weekdays').setValue(this.weekdays.join(','),  { emitEvent: true })
    this.colletionRoutineSV.save({...this.colletionRoutineForm.value}).subscribe(response => {
      this.showModal = !this.showModal;
      this.getList()
    })
  }

  checkedWeekday(event: any, weekday: string){
    if (event.target.checked) {
      this.weekdays.push(weekday)
    } else {
      const index = this.weekdays.indexOf(weekday);
      if (index !== -1) {
          this.weekdays.splice(index, 1);
      }
    }
  }

  filterBarrios(value: string) {
    if (!value) {
      this.filteredBarrios = this.barrios;
    } else {
      this.filteredBarrios = this.barrios.filter(barrio =>
        barrio.name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  selectBarrio(barrio) {
    this.colletionRoutineForm.get('neighborhood').setValue(barrio.value, { emitEvent: true });
    this.searchControl.setValue(barrio.name, { emitEvent: false }); // Evita que el filtro se dispare
    this.filteredBarrios = [];
    this.showBarrios = false;
    this.colletionRoutineForm.get('neighborhood').markAsTouched();  // Marca el control como 'tocado'
    this.colletionRoutineForm.get('neighborhood').updateValueAndValidity(); // Actualiza la validación
  }

  hideBarrios() {
    setTimeout(() => {
      this.showBarrios = false;
    }, 100);
  }

}
