import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BarriosService } from 'src/app/services/barrios.service';
import Swal from 'sweetalert2';
import { debounceTime, startWith } from 'rxjs/operators';
import { ColletionRoutineService } from 'src/app/services/colletion-routine.service';

@Component({
  selector: 'app-canlendar',
  templateUrl: './canlendar.component.html',
  styleUrls: ['./canlendar.component.css']
})
export class CanlendarComponent implements OnInit {

  public monthsList:any[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  public weekdaysList:any[] = [
    {name: 'Domingo',nameSm: 'Dom'},
    {name: 'Lunes',nameSm: 'Lun'},
    {name: 'Martes',nameSm: 'Mar'},
    {name: 'Miércoles',nameSm: 'Mie'},
    {name: 'Jueves',nameSm: 'Jue'},
    {name: 'Viernes',nameSm: 'Vie'},
    {name: 'Sabado',nameSm: 'Sab'}
  ]
  public dateCurrent:any = new Date()
  public year:number
  public month:string = ''
  public numMonth:number
  public weekdayCurrent:number
  public dayCurrent:number
  public lastDay: number
  public lastDayLastMonth: number
  public firstWeekday: number
  public amountWeek: number
  public objWeeks: any[] = []
  
  calendarForm: FormGroup;
  barrios: any[] = [];
  filterText = '';
  showBarrios = false;
  filteredBarrios = [...this.barrios];
  searchControl: FormControl = new FormControl();

  constructor(private fb: FormBuilder,private barriosService: BarriosService, private colletionRoutineSV: ColletionRoutineService) {
    this.numMonth = this.dateCurrent.getMonth()
    this.month = this.monthsList[this.numMonth]
    this.year = this.dateCurrent.getFullYear()
    this.weekdayCurrent = this.dateCurrent.getDay()
    this.dayCurrent = this.dateCurrent.getDate()
    this.lastDay = new Date(this.year, this.numMonth + 1, 0).getDate()
    this.lastDayLastMonth = new Date(this.year, (this.numMonth - 1) + 1, 0).getDate()
    this.firstWeekday = this.getFirstWeekday()
    this.amountWeek = Math.round((this.firstWeekday + 30) / 7)
    this.buildCalendarDays()

    this.calendarForm = this.fb.group({
      neighborhood: ['', Validators.required]
    });

    this.searchControl.valueChanges
    .pipe(
      debounceTime(300), // Agrega un retardo de 300ms al filtro para mejorar el rendimiento
      startWith('')
    )
    .subscribe(value => {
      this.filterBarrios(value);
    });
  }

  ngOnInit(): void {
    this.barriosService.getBarrios().subscribe(data => {
      this.barrios = data.barrios;
      this.filteredBarrios=data.barrios
    });
  }

  onSubmit(){
    this.colletionRoutineSV.getByNeighborhood(this.calendarForm.value).subscribe( response=> {
      let data = response.data[0]
      this.objWeeks = this.objWeeks.map(item =>
        item.map(day => {
          const dayName = this.weekdaysList[day.weekday]?.name
          if (dayName && data.weekdays.includes(dayName)) {
            day.text = `${data.startHour} - ${data.endHour}`;
          }
          return day
        })
      )

      console.log(this.objWeeks)
    })
  }
  
  buildCalendarDays(){
    let first = this.firstWeekday
    let con = 1
    for (let i = 0; i < this.amountWeek; i++) {
      let week = []
      if (i == 0){
        for (let j = 0; j < 7; j++) {
          if (first > 0){
            first--
            week.push({text:'',weekday:j,day:this.lastDayLastMonth - first})
          }else {
            week.push({text:'',weekday:j,day:con++})
          }
        }
      }else{
        for (let j = 0; j < 7; j++) {
          if (con <= this.lastDay){
            week.push({text:'',weekday:j,day:con++})
          }else{
            con = 1
            week.push({text:'',weekday:j,day:con++})
          }
        }
      }
      this.objWeeks.push(week)
    }
  }  

  getFirstWeekday(){
    let day = 1 - 1
    let weekday = 3
    for (let i = 0; i < day; i++) {
      if (weekday > 0 && day > 0){
        weekday = weekday - 1
      }else if(weekday == 0 && day > 0){
        weekday = 6
      }
    }
    return weekday
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
    this.calendarForm.get('neighborhood').setValue(barrio.value, { emitEvent: true });
    this.searchControl.setValue(barrio.name, { emitEvent: false }); // Evita que el filtro se dispare
    this.filteredBarrios = [];
    this.showBarrios = false;
    this.calendarForm.get('neighborhood').markAsTouched();  // Marca el control como 'tocado'
    this.calendarForm.get('neighborhood').updateValueAndValidity(); // Actualiza la validación
  }

  hideBarrios() {
    setTimeout(() => {
      this.showBarrios = false;
    }, 100);
  }

  /**
   * Get Current Day Month Year
   * Get weekday current
   * OnNext and OnLast Month only One
   *    Whit button or day next month
   * labs by categories color
   * show detail one day
   * 
   */

}
