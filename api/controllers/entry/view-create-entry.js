module.exports = {
  friendlyName: 'View create entry',

  description: 'Display the "Create Entry" form.',

  exits: {
    success: {
      responseType: 'inertia'
    }
  },

  fn: async function () {
    return { page: 'entries/create' }
  }
}
