module.exports = {
  friendlyName: 'Update entry',

  description: 'Update an existing entry.',

  inputs: {
    id: {
      type: 'number',
      required: true
    },
    title: {
      type: 'string',
      maxLength: 200
    },
    body: {
      type: 'string',
      allowNull: true
    },
    url: {
      type: 'string',
      allowNull: true
    },
    status: {
      type: 'string',
      isIn: ['todo', 'in_progress', 'done']
    },
    priority: {
      type: 'string',
      isIn: ['low', 'medium', 'high']
    },
    tags: {
      type: 'json'
    },
    isPinned: {
      type: 'boolean'
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    },
    notFound: {
      responseType: 'notFound'
    },
    invalid: {
      responseType: 'badRequest'
    }
  },

  fn: async function ({ id, ...valuesToSet }) {
    const entry = await Entry.updateOne({
      id,
      owner: this.req.session.userId
    }).set(valuesToSet)

    if (!entry) throw 'notFound'

    sails.inertia.flash('success', 'Entry updated!')
    return `/entries/${id}`
  }
}
