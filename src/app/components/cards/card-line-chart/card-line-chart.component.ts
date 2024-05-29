import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import Chart from "chart.js";
import { ReportsService } from "src/app/services/reports.service";

@Component({
  selector: "app-card-line-chart",
  templateUrl: "./card-line-chart.component.html",
})
export class CardLineChartComponent implements OnInit {
  @ViewChild('lineChart') private chartRef: ElementRef<HTMLCanvasElement>;
  constructor(private reportService: ReportsService) {}

  ngOnInit() {}
 
  ngAfterViewInit() {
    this.reportService.getReports().subscribe(reports => {
      const wasteTypes = reports.map(report => report.wasteType);
      const counts = {};

      wasteTypes.forEach(function (type) {
        counts[type] = (counts[type] || 0) + 1;
      });

      this.createChart(Object.keys(counts), Object.values(counts));
    });
  }

  createChart(labels, data) {
    const config = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Reportes por Tipo de Residuo',
          backgroundColor: '#4c51bf',
          borderColor: '#4c51bf',
          data: data,
          fill: false,
        }],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          labels: {
            fontColor: 'white',
          },
          align: 'end',
          position: 'bottom',
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: 'rgba(255,255,255,.7)',
            },
          }],
          yAxes: [{
            ticks: {
              fontColor: 'rgba(255,255,255,.7)',
            },
          }],
        },
      },
    };

    if (this.chartRef && this.chartRef.nativeElement) {
      const ctx = this.chartRef.nativeElement.getContext('2d');
      new Chart(ctx, config);
    }
  }
}
