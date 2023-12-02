import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-alert-details',
  templateUrl: './alert-details.component.html',
  styleUrls: ['./alert-details.component.scss']
})
export class AlertDetailsComponent implements OnInit, AfterViewInit {

  map: any;

  data: any;

  dataSource = new MatTableDataSource();

  descriptions: Array<string> = [];

  columnsToDisplay = ['updates'];

  constructor() { } 

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('session'));
    this.createDescriptions();
    this.getCurrentPosition();
  }

  ngAfterViewInit(): void {
  }

  createDescriptions() {
    // Uppercase first letter of title
    this.data.title = this.data.title.charAt(0).toUpperCase() + this.data.title.slice(1);

    //  Create Descriptions list
    //const firstWord = this.data.description.split(' ').slice(0, 1);
    const descriptions: Array<string> = this.data.description.split(/(?=UC)/g);
    if (descriptions && descriptions.length > 0) {
      descriptions.forEach((d) => {
        this.descriptions.push(d);
      });
    }
    this.dataSource = new MatTableDataSource(this.descriptions);
  }

  getCurrentPosition() {
    this.map = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoieW1lYXRjaGVtMTMiLCJhIjoiY2xhNjM5NmhzMWhhdTN3cGN5dXEzOTEybSJ9.D92OcW9H5SzTDP4XeoYy3g',
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.data.longitude, this.data.latitude],
      zoom: 16
    });

    // Set Navigation Controls
    const nav = new mapboxgl.NavigationControl()
    this.map.addControl(nav)

    // Set UC Alert Markers
    if (this.data) {
        // Alert from current date
        const currentDate: Date = new Date();
        const twoWeekDate: Date = new Date(currentDate.setDate(currentDate.getDate() - 14));
        
        this.data.date = new Date(this.data.date);
        if (this.data.date.getTime() == currentDate.getTime()){
          new mapboxgl.Marker({ "color": "#CB2B3E" })
          .setLngLat([this.data.longitude, this.data.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25})
            .setHTML(this.data.description)
          ).addTo(this.map)
        }  else if (this.data.date.getTime() <= twoWeekDate.getTime()) {
          new mapboxgl.Marker({ "color": "#2AAD27" })
          .setLngLat([this.data.longitude, this.data.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25})
            .setHTML(this.data.description)
          ).addTo(this.map)
        } else if (this.data.date.getTime() > twoWeekDate.getTime()){
          new mapboxgl.Marker({ "color": "#FFD326" })
          .setLngLat([this.data.longitude, this.data.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25})
            .setHTML(this.data.description)
          ).addTo(this.map)
        }
    }
  }

}
