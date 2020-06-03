import React, { useState, useEffect, createRef } from 'react'
import { Map as LeafletMap, TileLayer, Marker } from 'react-leaflet'
import styled from 'styled-components'

const LeafletContainer = styled.div`
	height: 450px;
	.leaflet-container {
		height: 450px;
	}
`

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
	const mapRef = createRef<LeafletMap>()
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
		<LeafletContainer>
			<LeafletMap
				viewport={{
					center: [mapPosition.lat, mapPosition.lng],
					zoom,
				}}
				zoom={zoom}
				ref={mapRef}
				onclick={(e: { latlng: { lat: number; lng: number } }) => {
					setMapPosition({
						...e.latlng,
						manual: true,
					})
					onPositionChange(e.latlng)
				}}
				onzoomend={(e: object) => {
					const z = mapRef?.current?.viewport?.zoom ?? 0
					if (z > 0) {
						setZoom(z)
					}
				}}
			>
				<TileLayer
					attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={[mapPosition.lat, mapPosition.lng]} />
			</LeafletMap>
		</LeafletContainer>
	)
}
