import Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useRef, useState } from 'react'

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
	const mapDiv = useRef<HTMLDivElement>(null)
	const mapRef = useRef<L.Map>()
	const markerLayerRef = useRef<L.LayerGroup>()
	const [mapPosition, setMapPosition] = useState({
		lat: 63.4210168,
		lng: 10.4366774,
		manual: false,
	})

	// Set map position from the browser
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
	}, [hasGeoLocationApi, mapPosition.manual])

	// Report positions when clicked
	// This is handled here and not in Leaflet onClick handler, because it does not have access to the react state and the callback, when executed, does not have access to the react state
	useEffect(() => {
		if (!mapPosition.manual) return
		onPositionChange(mapPosition)
	}, [mapPosition])

	// Init map
	useEffect(() => {
		if (mapDiv.current === null) return
		mapRef.current = Leaflet.map(mapDiv.current).setView(
			[mapPosition.lat, mapPosition.lng],
			13,
		)

		// add the OpenStreetMap tiles
		Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution:
				'&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
		}).addTo(mapRef.current)

		mapRef.current.on('click', (event: { latlng: L.LatLng }) => {
			setMapPosition({
				...event.latlng,
				manual: true,
			})
		})

		// Init layer
		markerLayerRef.current = Leaflet.layerGroup().addTo(mapRef.current)

		return () => {
			markerLayerRef.current?.off()
			markerLayerRef.current?.remove()
		}
	}, [mapDiv])

	// Draw marker
	useEffect(() => {
		markerLayerRef.current?.clearLayers()
		if (markerLayerRef.current === undefined) return
		if (mapRef.current === undefined) return
		const zoom = mapRef.current.getZoom()

		Leaflet.marker([mapPosition.lat, mapPosition.lng], { icon }).addTo(
			markerLayerRef.current,
		)
		Leaflet.circle([mapPosition.lat, mapPosition.lng], {
			radius: accuracy,
			color: '#1f56d2',
		}).addTo(markerLayerRef.current)

		const { x, y } = mapRef.current.project(mapPosition, zoom)
		const endpoint = mapRef.current.unproject(
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
		}).addTo(markerLayerRef.current)
	}, [accuracy, mapPosition, heading])

	return <div ref={mapDiv} style={{ width: '100%', height: '450px' }} />
}
