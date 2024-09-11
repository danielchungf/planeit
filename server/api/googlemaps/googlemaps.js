import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const { id, name } = getQuery(event)
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (id) {
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${id}`
  } else if (name) {
    const encodedName = encodeURIComponent(name)
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedName}`
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Either id or name must be provided',
    })
  }
})
