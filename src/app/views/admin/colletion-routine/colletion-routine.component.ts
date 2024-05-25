import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { iBarrios } from 'src/app/models/barrios';
import { iColletionRoutine } from 'src/app/models/colletion-routine';
import { BarriosService } from 'src/app/services/barrios.service';
import { ColletionRoutineService } from 'src/app/services/colletion-routine.service';
import { debounceTime, startWith } from 'rxjs/operators';
import { iItemsDropdown } from 'src/app/models/items-dropdown';

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
  list: iColletionRoutine[] = []
  itemsDropdown: iItemsDropdown[] = [
    {
      text: 'Editar'
    },
    {
      text: 'Eliminar'
    }
  ]
  showModal: boolean = false
  colletionRoutineForm: FormGroup;
  showBarrios = false;
  barrios: iBarrios[] = [];
  filteredBarrios = [...this.barrios];
  searchControl: FormControl = new FormControl();
  weekdays: string[] = []
  titleModal:string = ''

  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";
  constructor(private fb: FormBuilder, private colletionRoutineSV: ColletionRoutineService, private barriosService: BarriosService) {
    this.colletionRoutineForm = this.fb.group({
      id: [],
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

  onGoTo(event:any){
    switch (event.event) {
      case 'Editar':
          this.openModalEdit(event.id)
        break;
      case 'Eliminar':
          this.deleteColletionRoutine(event.id)
        break;
    
      default:
        break;
    }
  }

  deleteColletionRoutine(id:any){
    this.colletionRoutineSV.delete(id).subscribe(response => {
      this.getList()
    })
  }

  openModalEdit(id:any){
    this.titleModal = 'Editar rutina de recolección'
    let index = this.list.findIndex(item => item.id == id)
    let element = this.list[index]
    this.colletionRoutineForm.get('id').setValue(element.id)
    this.selectBarrio({ name: element.neighborhood, value: element.neighborhood })
    this.colletionRoutineForm.get('startHour').setValue(element.startHour)
    this.colletionRoutineForm.get('endHour').setValue(element.endHour)
    this.weekdays = element.weekdays
    this.showModal = !this.showModal;
  }

  toggleModal() {
    this.titleModal = 'Crear rutina de recolección'
    this.showModal = !this.showModal;
  }

  onSubmit() {
    this.colletionRoutineForm.get('weekdays').setValue(this.weekdays.join(','),  { emitEvent: true })
    if (this.colletionRoutineForm.valid) {
      if (this.colletionRoutineForm.value.id) {
        this.colletionRoutineSV.update({...this.colletionRoutineForm.value}).subscribe(response => {
          this.showModal = !this.showModal;
          this.getList()
          this.colletionRoutineForm.reset()
        })
      }else{
        this.colletionRoutineSV.save({...this.colletionRoutineForm.value}).subscribe(response => {
          this.showModal = !this.showModal;
          this.getList()
          this.colletionRoutineForm.reset()
        })
      }
    }else{
      this.markAsTouched()
    }
  }

  markAsTouched(){
    this.colletionRoutineForm.get('neighborhood')?.markAsTouched();
    this.colletionRoutineForm.get('startHour')?.markAsTouched();
    this.colletionRoutineForm.get('endHour')?.markAsTouched();
    this.colletionRoutineForm.get('weekdays')?.markAsTouched();
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

  preCheckedWeekday(weekday:string):boolean{
    return this.weekdays.findIndex(item => item == weekday) != -1
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
    this.searchControl.setValue(barrio.name, { emitEvent: false });
    this.filteredBarrios = [];
    this.showBarrios = false;
    this.colletionRoutineForm.get('neighborhood').markAsTouched();
    this.colletionRoutineForm.get('neighborhood').updateValueAndValidity();
  }

  hideBarrios() {
    setTimeout(() => {
      this.showBarrios = false;
    }, 100);
  }

}
