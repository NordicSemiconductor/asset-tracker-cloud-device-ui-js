const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180
const radiansToDegreens = (radians: number) => (radians * 180) / Math.PI

export const calculateHeading = (
	from: { lat: number; lng: number },
	to: { lat: number; lng: number },
): number => {
	const fromLat = degreesToRadians(from.lat)
	const fromLng = degreesToRadians(from.lng)
	const toLat = degreesToRadians(to.lat)
	const toLng = degreesToRadians(to.lng)

	const y = Math.sin(toLng - fromLng) * Math.cos(toLat)
	const x =
		Math.cos(fromLat) * Math.sin(toLat) -
		Math.sin(fromLat) * Math.cos(toLat) * Math.cos(toLng - fromLng)

	const hdg = radiansToDegreens(Math.atan2(y, x))
	return (hdg + 360) % 360
}
