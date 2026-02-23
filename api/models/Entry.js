/**
 * Entry.js
 *
 * @description :: A single polymorphic content entry (note, task, log, bookmark, or journal).
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'entries',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    type: {
      type: 'string',
      required: true,
      isIn: ['note', 'task', 'log', 'bookmark', 'journal'],
      description: 'The kind of entry.'
    },
    title: {
      type: 'string',
      required: true,
      maxLength: 200,
      description: 'The title or heading of the entry.'
    },
    body: {
      type: 'string',
      allowNull: true,
      description: 'Optional long-form content (markdown-friendly).'
    },
    url: {
      type: 'string',
      allowNull: true,
      isURL: true,
      description: 'For bookmarks — the external URL.'
    },
    status: {
      type: 'string',
      isIn: ['todo', 'in_progress', 'done'],
      defaultsTo: 'todo',
      description: 'For tasks — the current status.'
    },
    priority: {
      type: 'string',
      isIn: ['low', 'medium', 'high'],
      defaultsTo: 'medium',
      description: 'For tasks — the priority level.'
    },
    tags: {
      type: 'json',
      defaultsTo: [],
      description: "Array of tag strings, e.g. ['work', 'idea']."
    },
    isPinned: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Pinned entries float to the top of listings.',
      columnName: 'is_pinned'
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    owner: {
      model: 'user',
      required: true,
      description: 'The user who owns this entry.'
    }
  }
}
