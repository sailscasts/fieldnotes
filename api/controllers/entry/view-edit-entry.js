module.exports = {
  friendlyName: 'View edit entry',

  description: 'Display the "Edit Entry" form.',

  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'inertia'
    },
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function ({ id }) {
    const entry = await Entry.findOne({ id, owner: this.req.session.userId })
    if (!entry) throw 'notFound'

    return { page: 'entries/edit', props: { entry } }
  }
}
