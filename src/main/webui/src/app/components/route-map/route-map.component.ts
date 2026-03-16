import { Component, Input, AfterViewInit, ElementRef, ViewChild, OnChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-route-map',
  template: `<div #mapEl class="map-container"></div>`,
  styles: [`.map-container { height: 200px; width: 100%; border-radius: 8px; }`]
})
export class RouteMapComponent implements AfterViewInit, OnChanges {
  @Input() polyline = '';
  @ViewChild('mapEl') mapEl!: ElementRef;
  private map?: L.Map;

  ngAfterViewInit() { this.renderMap(); }
  ngOnChanges() { if (this.mapEl) this.renderMap(); }

  private renderMap() {
    if (!this.polyline) return;
    const coords = this.decode(this.polyline);
    if (!coords.length) return;

    if (this.map) this.map.remove();
    this.map = L.map(this.mapEl.nativeElement, { zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    const line = L.polyline(coords, { color: '#fc4c02', weight: 3 }).addTo(this.map);
    this.map.fitBounds(line.getBounds(), { padding: [20, 20] });
  }

  private decode(encoded: string): L.LatLngTuple[] {
    const points: L.LatLngTuple[] = [];
    let i = 0, lat = 0, lng = 0;
    while (i < encoded.length) {
      let shift = 0, result = 0, byte: number;
      do { byte = encoded.charCodeAt(i++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
      lat += (result & 1) ? ~(result >> 1) : (result >> 1);
      shift = 0; result = 0;
      do { byte = encoded.charCodeAt(i++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
      lng += (result & 1) ? ~(result >> 1) : (result >> 1);
      points.push([lat / 1e5, lng / 1e5]);
    }
    return points;
  }
}
