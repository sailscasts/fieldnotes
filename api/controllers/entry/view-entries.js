module.exports = {
  friendlyName: 'View entries',
  description:
    'Display the entries list with search, filtering, sorting, and pagination.',
  inputs: {
    type: {
      type: 'string',
      isIn: ['note', 'task', 'log', 'bookmark', 'journal']
    },
    status: {
      type: 'string',
      isIn: ['todo', 'in_progress', 'done']
    },
    search: {
      type: 'string',
      defaultsTo: ''
    },
    sort: {
      type: 'string',
      isIn: ['newest', 'oldest', 'title'],
      defaultsTo: 'newest'
    },
    page: {
      type: 'number',
      min: 1,
      defaultsTo: 1
    }
  },

  exits: {
    success: {
      responseType: 'inertia'
    }
  },

  fn: async function ({ type, status, search, sort, page }) {
    const perPage = 20
    const userId = this.req.session.userId

    // Build criteria
    let criteria = { owner: userId }
    if (type) criteria.type = type
    if (status) criteria.status = status
    if (search && search.length >= 2) {
      criteria.or = [
        { title: { contains: search }, owner: userId },
        { body: { contains: search }, owner: userId }
      ]
      if (type) criteria.or.forEach((c) => (c.type = type))
      if (status) criteria.or.forEach((c) => (c.status = status))
    }

    // Sort mapping
    const sortMap = {
      newest: 'createdAt DESC',
      oldest: 'createdAt ASC',
      title: 'title ASC'
    }

    const [entries, total] = await Promise.all([
      Entry.find(criteria)
        .sort([{ isPinned: 'DESC' }, sortMap[sort]])
        .skip((page - 1) * perPage)
        .limit(perPage),
      Entry.count(criteria)
    ])

    return {
      page: 'entries/index',
      props: {
        entries,
        filters: { type, status, search, sort },
        pagination: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage)
        }
      }
    }
  }
}
