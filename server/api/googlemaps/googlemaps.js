import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const { id, name } = getQuery(event)
  const config = useRuntimeConfig(event)
  const apiKey = config.GOOGLE_MAPS_API_KEY

  console.log('API Key:', apiKey) // Log the API key (be careful with this in production)
  console.log('Query:', { id, name }) // Log the query parameters

  if (id) {
    const url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${id}`
    console.log('Generated URL:', url)
    return url
  } else if (name) {
    const encodedName = encodeURIComponent(name)
    const url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedName}`
    console.log('Generated URL:', url)
    return url
  } else {
    console.log('Error: No id or name provided')
    throw createError({
      statusCode: 400,
      statusMessage: 'Either id or name must be provided',
    })
  }
})
