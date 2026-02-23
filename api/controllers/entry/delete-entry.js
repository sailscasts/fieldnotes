module.exports = {
  friendlyName: 'Delete entry',

  description: 'Delete an entry.',

  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    },
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function ({ id }) {
    const entry = await Entry.destroyOne({
      id,
      owner: this.req.session.userId
    })
    if (!entry) throw 'notFound'

    sails.inertia.flash('success', 'Entry deleted!')
    return '/entries'
  }
}
