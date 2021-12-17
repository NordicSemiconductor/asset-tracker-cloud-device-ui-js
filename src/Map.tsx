import Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type {
	Map as LeafletMap,
	LeafletMouseEvent,
	LeafletEvent,
} from 'leaflet'
import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'

const EventHandler = ({
	onZoomEnd,
	onClick,
}: {
	onZoomEnd: (args: { event: LeafletEvent; map: LeafletMap }) => void
	onClick: (args: { event: LeafletMouseEvent; map: LeafletMap }) => void
}) => {
	const map = useMapEvents({
		click: (event) => onClick({ event, map }),
		zoomend: (event) => onZoomEnd({ event, map }),
	})
	return null
}

export const Map = ({
	onPositionChange,
}: {
	onPositionChange: (args: { lat: number; lng: number }) => void
}) => {
	const [mapPosition, setMapPosition] = useState({
		lat: 63.4210168,
		lng: 10.4366774,
		manual: false,
	})
	const [zoom, setZoom] = useState(13)
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

	return (
		<div>
			<MapContainer
				center={[mapPosition.lat, mapPosition.lng]}
				zoom={zoom}
				style={{ height: '450px' }}
			>
				<EventHandler
					onZoomEnd={({ map }) => {
						setZoom(map.getZoom())
					}}
					onClick={({ event }) => {
						setMapPosition({
							...event.latlng,
							manual: true,
						})
						onPositionChange(event.latlng)
					}}
				/>
				<TileLayer
					attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker
					position={[mapPosition.lat, mapPosition.lng]}
					icon={Leaflet.icon({
						iconUrl: 'logo.svg',
						iconSize: [50, 50],
						iconAnchor: [25, 50],
					})}
				/>
			</MapContainer>
		</div>
	)
}
