const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    // : blogs.reduce((sum, blog) => sum + blog.likes, 0)
    : _.sumBy(blogs, 'likes')
}

const favoriteBlog = (blogs) => {
  // const mostLikes = Math.max(...blogs.map(blog => blog.likes))

  return blogs.length === 0
    ? {}
    // : blogs.filter(blog => blog.likes === mostLikes)[0]
    : _.maxBy(blogs, 'likes')
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  // const authors = _.countBy(blogs, 'author')
  // const mostBlogs = _.max(_.values(authors))
  // const author = _.findKey(authors, a => a === mostBlogs)

  // return {
  //   author,
  //   blogs: mostBlogs
  // }

  // Method using map
  const numBlogs = _.countBy(blogs, 'author')
  const totals = _.map(numBlogs, (total, author) => {
    return {
      author,
      blogs: total
    }
  })

  return _.maxBy(totals, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  // const authors = _.groupBy(blogs, 'author')
  // const likes = _.mapValues(authors, o => _.sumBy(o, 'likes'))
  // const mostLikes = _.max(_.values(likes))
  // const author = _.findKey(likes, a => a === mostLikes)

  // return {
  //   author,
  //   likes: mostLikes
  // }

  // Method using map
  const authors = _.groupBy(blogs, 'author')
  const likes = _.map(authors, (blogList, author) => {
    return {
      author,
      likes: _.sumBy(blogList, 'likes')
    }
  })

  return _.maxBy(likes, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}