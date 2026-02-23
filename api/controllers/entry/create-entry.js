module.exports = {
  friendlyName: 'Create entry',

  description: 'Create a new entry.',

  inputs: {
    type: {
      type: 'string',
      required: true,
      isIn: ['note', 'task', 'log', 'bookmark', 'journal']
    },
    title: {
      type: 'string',
      required: true,
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
      isIn: ['todo', 'in_progress', 'done'],
      defaultsTo: 'todo'
    },
    priority: {
      type: 'string',
      isIn: ['low', 'medium', 'high'],
      defaultsTo: 'medium'
    },
    tags: {
      type: 'json',
      defaultsTo: []
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    },
    invalid: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs) {
    const entry = await Entry.create({
      ...inputs,
      owner: this.req.session.userId
    }).fetch()

    sails.inertia.flash('success', 'Entry created!')
    return `/entries/${entry.id}`
  }
}
