import { Component, ViewChild } from '@angular/core';
import { Endpoint, GeocoderService, PlaceType } from '../geocoder.service';
import { SharedService } from '../shared.service';
import { MapModel } from '../map.model';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { MatTableDataSource } from '@angular/material/table';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {

  @ViewChild(MatSidenav) sidenav : MatSidenav;

  title = 'clientApp';

  mapReady = false;

  dataSource = new MatTableDataSource();

  constructor(private service: SharedService, private geocoderService: GeocoderService, private observer: BreakpointObserver, private dialog: MatDialog) {
    this.dialog.closeAll();
  }

  alertList: Array<any> = [];

  mapMarkerList: Array<MapModel> = [];

  map: any;

  markers: Array<any>;

  columnsToDisplay = ['title', 'date'];

  searchInput: string = '';

  ngOnInit(): void {
    // Enabled location check
    if (!navigator.geolocation) {
      console.log('location is not supported');
    }

    // Initial call to return Alerts list
    this.refreshAlertList();
    this.getAlertComments();
  }

  ngAfterViewInit() {
    this.observer.observe([Breakpoints.Small]).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  getCurrentPosition() {
    // Get user current position
    navigator.geolocation.getCurrentPosition((position) => {
      this.map = new mapboxgl.Map({
        accessToken: 'pk.eyJ1IjoieW1lYXRjaGVtMTMiLCJhIjoiY2xhNjM5NmhzMWhhdTN3cGN5dXEzOTEybSJ9.D92OcW9H5SzTDP4XeoYy3g',
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 13
      });

      // Set Direction Controls
      this.map.addControl(
        new MapboxDirections({
          accessToken: 'pk.eyJ1IjoieW1lYXRjaGVtMTMiLCJhIjoiY2xhNjM5NmhzMWhhdTN3cGN5dXEzOTEybSJ9.D92OcW9H5SzTDP4XeoYy3g',
          interactive: false,
        }),
        'top-left'
      );

      // Set Navigation Controls
      const nav = new mapboxgl.NavigationControl()
      this.map.addControl(nav)

      // Set User Location Markers
      const marker = new mapboxgl.Marker()
            .setLngLat([position.coords.longitude, position.coords.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25})
              .setHTML('<b>Your Location</b>')
            ).addTo(this.map)

      const markerDiv = marker.getElement();
      markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
      markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
    });
    this.watchPosition();
  }

  setAlertMarkers() {
    // Set UC Alert Markers
    if (this.mapMarkerList && this.mapMarkerList.length > 0) {
      this.mapMarkerList.forEach((mapMarker) => {
        // Alert from current date
        const currentDate: Date = new Date();
        const oneDayDate: Date = new Date(currentDate.setDate(currentDate.getDate() - 1));
        const twoWeekDate: Date = new Date(currentDate.setDate(currentDate.getDate() - 14));

        mapMarker.date = new Date(mapMarker.date);
        if (mapMarker.date.getTime() >= oneDayDate.getTime()){
          const marker = new mapboxgl.Marker({ "color": "#CB2B3E" })
          .setLngLat([mapMarker.longitude, mapMarker.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25})
            .setHTML(mapMarker.address)
          ).addTo(this.map)

          const markerDiv = marker.getElement();
          markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
          markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
        }  else if (mapMarker.date.getTime() <= twoWeekDate.getTime()) {
          const marker = new mapboxgl.Marker({ "color": "#2AAD27" })
          .setLngLat([mapMarker.longitude, mapMarker.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25})
            .setHTML(mapMarker.address)
          ).addTo(this.map)

          const markerDiv = marker.getElement();
          markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
          markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
          markerDiv.addEventListener('click',  () => {
            if (mapMarker.address) {
              const currentMarker: MapModel = this.mapMarkerList.find(m => m.address == mapMarker.address);
              if (currentMarker != undefined) {
                this.routeToAlertDetail(currentMarker);
              }
            }
          });
        } else if (mapMarker.date.getTime() > twoWeekDate.getTime()){
          const marker = new mapboxgl.Marker({ "color": "#FFD326" })
          .setLngLat([mapMarker.longitude, mapMarker.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25})
            .setHTML(mapMarker.address)
          ).addTo(this.map)

          const markerDiv = marker.getElement();
          markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
          markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
        }
      });
    }
  }

  watchPosition() {
    let desLat = 0;
    let desLon = 0;
    let id = navigator.geolocation.watchPosition((position) => {
      if (position.coords.latitude === desLat) {
        navigator.geolocation.clearWatch(id);
      }
    }, (err) => {
      console.log(err);
    },
    {
      enableHighAccuracy: true,
      timeout: 35000,
      maximumAge: 0,
    });
  }

  refreshAlertList() {
    // Get Alerts from Database
    this.service
      .getAlertList()
      .subscribe({
        next: (alerts: Array<any>) => {
          if (alerts){
            this.alertList = alerts.sort(function(a,b) {
              return new Date(b.AlertDate).valueOf() - new Date(a.AlertDate).valueOf();
            });
            this.getCurrentPosition();
            this.getAlertCoordinates();
          }
        }
      });
  }

  getAlertComments() {
    // Get Comments from Database
    this.service
      .getCommentsList()
      .subscribe({
        next: (comments: Array<any>) => {
          if (comments){
            localStorage.setItem('commentList',JSON.stringify(comments));
          }
        }
      })
  }

  getAlertCoordinates() {
    // Convert Alert street addresses into coordinates
    if (this.alertList && this.alertList.length > 0) {
      this.alertList.forEach((alert: any) => {
        this.geocoderService.forwardGeocoding(
          Endpoint.PLACES,
          `${alert.StreetAddress}, Cincinnati, Ohio`,
          'pk.eyJ1IjoieW1lYXRjaGVtMTMiLCJhIjoiY2xhNjM5NmhzMWhhdTN3cGN5dXEzOTEybSJ9.D92OcW9H5SzTDP4XeoYy3g',
          ['us'],
          [PlaceType.ADDRESS]
        )
        .subscribe((res: any) => {
          if (res.features[0]?.center) {
            const mapModel: MapModel = new MapModel();
            mapModel.alertID = alert.AlertID;
            // Title substring index
            let titleStart: number = alert.AlertDescription.indexOf('emergency');
            if (titleStart === -1 || titleStart > 35) {
              titleStart = alert.AlertDescription.indexOf('activity');
            } 
            const titleEnd: number = alert.AlertDescription.indexOf('.');
            mapModel.title = alert.AlertDescription.substring(titleStart, titleEnd);

            // Uppercase first letter of title
            mapModel.title = mapModel.title.charAt(0).toUpperCase() + mapModel.title.slice(1);

            mapModel.description = alert.AlertDescription;
            mapModel.latitude = res.features[0].center[1];
            mapModel.longitude = res.features[0].center[0];
            mapModel.address = alert.StreetAddress;
            mapModel.date = alert.AlertDate;
            this.mapMarkerList.push(mapModel);
          }
          const sortedMapMarkers = this.mapMarkerList.slice().sort((a, b) => Number(a.date) - Number(b.date));
          this.dataSource = new MatTableDataSource(sortedMapMarkers);
          if (this.alertList.length === this.mapMarkerList.length) {
            this.setAlertMarkers();
          }
        });
      });
    }
  }

  applySearchFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearchFilter() {
    this.searchInput = '';
    this.dataSource.filter = '';
  }

  routeToAlertDetail(marker: MapModel) {
    let data = marker;
    localStorage.setItem('session',JSON.stringify(data));

    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '77vh'; 
    dialogConfig.width = '20vw'; 
    dialogConfig.position = {left: '30.5vw', bottom: '18px'};
    dialogConfig.hasBackdrop = false;
    dialogConfig.closeOnNavigation = true; 
    this.dialog.open(AlertDialogComponent, dialogConfig);
  }

  // logout(): void {
  //   this.afAuth.signOut();
  // }
}


