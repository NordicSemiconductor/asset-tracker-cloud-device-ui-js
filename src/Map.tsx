import Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'

const width = 37.80887
const height = 50.2832
const scaling = 0.7

const icon = Leaflet.icon({
	iconUrl: '/marker.svg',
	iconSize: new Leaflet.Point(width * scaling, height * scaling),
	iconAnchor: new Leaflet.Point((width * scaling) / 2, height * scaling - 2),
})

export const Map = ({
	onPositionChange,
	heading,
	accuracy,
}: {
	onPositionChange: (args: { lat: number; lng: number }) => void
	heading: number
	accuracy: number
}) => {
	const [mapPosition, setMapPosition] = useState({
		lat: 63.4210168,
		lng: 10.4366774,
		manual: false,
	})
	const hasGeoLocationApi = 'geolocation' in navigator

	useEffect(() => {
		if (hasGeoLocationApi) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					if (!mapPosition.manual) {
						setMapPosition({
							lat: position.coords.latitude,
							lng: position.coords.longitude,
							manual: false,
						})
						onPositionChange({
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						})
					}
				},
				undefined,
				{ enableHighAccuracy: true },
			)
		}
	}, [hasGeoLocationApi, mapPosition.manual, onPositionChange])

	useEffect(() => {
		const map = Leaflet.map('map').setView(
			[mapPosition.lat, mapPosition.lng],
			13,
		)
		const zoom = map.getZoom()
		// add the OpenStreetMap tiles
		Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution:
				'&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
		}).addTo(map)

		map.on('click', (event: { latlng: L.LatLng }) => {
			setMapPosition({
				...event.latlng,
				manual: true,
			})
			onPositionChange(event.latlng)
		})

		Leaflet.marker([mapPosition.lat, mapPosition.lng], { icon }).addTo(map)
		Leaflet.circle([mapPosition.lat, mapPosition.lng], {
			radius: accuracy,
			color: '#1f56d2',
		}).addTo(map)

		const { x, y } = map.project(mapPosition, zoom)
		const endpoint = map.unproject(
			[
				x + zoom * 3 * Math.cos((((heading - 90) % 360) * Math.PI) / 180),
				y + zoom * 3 * Math.sin((((heading - 90) % 360) * Math.PI) / 180),
			],
			zoom,
		)

		Leaflet.polyline([mapPosition, endpoint], {
			weight: zoom > 16 ? 1 : 2,
			lineCap: 'round',
			color: '#00000080',
			stroke: true,
		}).addTo(map)

		return () => {
			map.off()
			map.remove()
		}
	}, [mapPosition, heading, accuracy])

	return <div id="map" style={{ width: '100%', height: '450px' }} />
}
