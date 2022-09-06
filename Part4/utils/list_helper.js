const dummy = () => {
  return 1
}

const sumLikes = blogs => {
  const likes = blogs.map(item => item.likes)
  return likes.reduce((partialSum, a) => partialSum + a, 0)
}

const favoriteBlog = blogs => {
  const likes = blogs.map(item => item.likes)
  const maxLikes = Math.max(...likes)
  const filter = blogs.filter(item => item.likes === maxLikes)
  return filter[0]
}

module.exports = {
  dummy,
  sumLikes,
  favoriteBlog
}