/* Where player votes go (shared/votes.js). Empty until Evan makes a Google Form: see docs/VOTES.md "Setting up the
   form". Fill in the form's formResponse address and each question's entry id, e.g.
   window.VOTES_CONFIG = { form: 'https://docs.google.com/forms/d/e/<form id>/formResponse',
     fields: { poll: 'entry.111', choice: 'entry.222', game: 'entry.333', version: 'entry.444', tester: 'entry.555' } }; */
window.VOTES_CONFIG = window.VOTES_CONFIG || {};
