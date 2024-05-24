//SISTEMA
import { Component, OnInit, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5radar from "@amcharts/amcharts5/radar";

//SERVICIOS
import { EstadisticaService } from 'src/app/core/services/estadistica.service';

@Component({
  selector: 'app-consultar-estadistica',
  templateUrl: './consultar-estadistica.component.html',
  styleUrls: ['./consultar-estadistica.component.css']
})
export class ConsultarEstadisticaComponent implements OnInit {

  //VARIABLES DE DATOS
  interesFinancieroCobrar: number;
  capitalTotalRecuperar: number;
  conceptoCapital: number;
  conceptoInteres: number;
  conceptoPunitorio: number;
  
  //VARIABLES DE OBJETOS LIST
  topClientes: string[];
  topPrestamos: string[];

  constructor(private servicioEstadistica: EstadisticaService) { 
  }

  async ngOnInit(): Promise<void> {
    this.crearChartActivosPorPlan();
    this.crearChartActivosCapital();
    this.crearTotales();
    this.crearTopClientes();
    this.crearTopPrestamos();    
  }

  //KPI de planes activos por plan
  crearChartActivosPorPlan(){
    let root = am5.Root.new("chartdiv");
  
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true
    }));
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);
    let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
      rotation: 0,
      centerY: am5.p50,
      centerX: am5.p50,
      paddingRight: 15,
      paddingTop: 15
    });
    xRenderer.grid.template.setAll({
      location: 1
    })
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "nombre",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));
    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })
    }));
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "cantidad",
      sequencedInterpolation: true,
      categoryXField: "nombre",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));
    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", function(fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
    series.columns.template.adapters.add("stroke", function(stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
    this.servicioEstadistica.consultaPrestamosActivosPlan().subscribe((data) => {
      xAxis.data.setAll(data);
      series.data.setAll(data);
    })
    series.appear(1000);
    chart.appear(1000, 100);
  }
  
  //KPI de préstamos activos por capital
  crearChartActivosCapital(){
    let root = am5.Root.new("chartdiv2");
    let myTheme = am5.Theme.new(root);
    myTheme.rule("Grid", ["base"]).setAll({
      strokeOpacity: 0.1
    });
    root.setThemes([
      am5themes_Animated.new(root),
      myTheme
    ]);
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none"
      })
    );
    let yRenderer = am5xy.AxisRendererY.new(root, { minGridDistance: 30 });
    yRenderer.grid.template.set("location", 1);
    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "rango",
        renderer: yRenderer
      })
    );
    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        renderer: am5xy.AxisRendererX.new(root, {
          visible: true,
          strokeOpacity: 0.1
        })
      })
    );
    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "cantPrestamos",
        sequencedInterpolation: true,
        categoryYField: "rango",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{cantPrestamos}"})
      })
    );
    let columnTemplate = series.columns.template;
    columnTemplate.setAll({
      draggable: true,
      cursorOverStyle: "pointer",
      tooltipText: "drag to rearrange",
      cornerRadiusBR: 10,
      cornerRadiusTR: 10,
      strokeOpacity: 0
    });
    columnTemplate.adapters.add("fill", (fill, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
    
    columnTemplate.adapters.add("stroke", (stroke, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
    
    columnTemplate.events.on("dragstop", () => {
      sortCategoryAxis();
    });
    
    function getSeriesItem(category) {
      for (var i = 0; i < series.dataItems.length; i++) {
        let dataItem = series.dataItems[i];
        if (dataItem.get("categoryY") == category) {
          return dataItem;
        }
      }
    }
    function sortCategoryAxis() {
      series.dataItems.sort(function(x, y) {
        return y.get("graphics").y() - x.get("graphics").y();
      });
    
      let easing = am5.ease.out(am5.ease.cubic);

      am5.array.each(yAxis.dataItems, function(dataItem) {
        let seriesDataItem = getSeriesItem(dataItem.get("category"));
      
        if (seriesDataItem) {
          let index = series.dataItems.indexOf(seriesDataItem);
        
          let column = seriesDataItem.get("graphics");
        
          let fy =
            yRenderer.positionToCoordinate(yAxis.indexToPosition(index)) -
            column.height() / 2;
        
          if (index != dataItem.get("index")) {
            dataItem.set("index", index);
          
            let x = column.x();
            let y = column.y();
          
            column.set("dy", -(fy - y));
            column.set("dx", x);
          
            column.animate({ key: "dy", to: 0, duration: 600, easing: easing });
            column.animate({ key: "dx", to: 0, duration: 600, easing: easing });
          } else {
            column.animate({ key: "y", to: fy, duration: 600, easing: easing });
            column.animate({ key: "x", to: 0, duration: 600, easing: easing });
          }
        }
      });
  
      yAxis.dataItems.sort(function(x, y) {
        return x.get("index") - y.get("index");
      });
    }
    this.servicioEstadistica.consultaPrestamosActivosCapital().subscribe((data) => {
        yAxis.data.setAll(data);
        series.data.setAll(data);
    })
    series.appear(1000);
    chart.appear(1000, 100);
  }

  //Tarjetas de deudas separadas por concepto
  crearTotales(){
    this.servicioEstadistica.consultaTotalPorConceptoCapital().subscribe((data) => {
      this.conceptoCapital = data;
    })
    this.servicioEstadistica.consultaTotalPorConceptoInteres().subscribe((data) => {
      this.conceptoInteres = data;
    })
    this.servicioEstadistica.consultaTotalPorConceptoPunitorio().subscribe((data) => {
      this.conceptoPunitorio = data;
    })
      
  }

  //Top 5 de Clientes de mayor deuda (capital + interés financiero)
  crearTopClientes(){
    this.servicioEstadistica.consultaClientesMayorDeuda().subscribe((data) => {
      this.topClientes = data;
    })
  }
  
  //KPI: Top 5 de Préstamos con mayor rentabilidad (interés financiero + punitorio de cuotas pagas) histórico
  crearTopPrestamos(){
    this.servicioEstadistica.consultaPrestamosConMayorRentabilidad().subscribe((data) => {0
      this.topPrestamos = data;
    })
  }      
}
    
      
      
      
      