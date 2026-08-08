// Shared search index + search logic, loaded on every page alongside
// projects-data.js. Builds one flat list of searchable entries - all 14
// projects (pulling in their tags, meta, and full case-study text) plus the
// static pages - so a single search box can find anything on the site
// regardless of which page it's opened from.

function buildSearchIndex() {
  var entries = [];

  if (typeof PROJECTS !== 'undefined') {
    Object.keys(PROJECTS).forEach(function(id) {
      var proj = PROJECTS[id];
      var textParts = [proj.name];

      (proj.meta || []).forEach(function(m) { textParts.push(m.label, m.value); });

      var tags = proj.tags || {};
      ['what', 'how', 'when'].forEach(function(group) {
        (tags[group] || []).forEach(function(t) { textParts.push(t); });
      });

      if (proj.quote) textParts.push(proj.quote);

      (proj.sections || []).forEach(function(sec) {
        textParts.push(sec.label);
        if (sec.lede) textParts.push(sec.lede);
        (sec.body || []).forEach(function(b) { textParts.push(b); });
        if (sec.pullQuote) textParts.push(sec.pullQuote);
        if (sec.prompt) textParts.push(sec.prompt);
      });

      entries.push({
        title: proj.name,
        type: 'Project',
        snippet: (proj.sections && proj.sections[0] && proj.sections[0].lede) || (proj.meta && proj.meta[0] && proj.meta[0].value) || '',
        url: 'portfolio.html?project=' + id,
        searchText: textParts.join(' ').toLowerCase()
      });
    });
  }

  // Static, non-project pages/sections. Kept short and specific so search
  // results stay meaningful rather than matching on filler words.
  var staticEntries = [
    {
      title: 'Diagram',
      type: 'Page',
      snippet: 'The interactive star-field diagram of all projects, grouped by visual systems design, design research, and content strategy.',
      url: 'portfolio.html',
      searchText: 'work diagram portfolio visual systems designer design researcher content strategist star field projects domains filters'
    },
    {
      title: 'Simple List',
      type: 'Page',
      snippet: 'All projects as a plain grid, sorted by role.',
      url: 'portfolio.html',
      searchText: 'simple list grid all projects prefer simpler list view all projects'
    },
    {
      title: 'Bio',
      type: 'Page',
      snippet: 'Janani Karthik, MFA Design for Social Innovation at SVA.',
      url: 'about.html',
      searchText: 'about bio janani karthik mfa design for social innovation sva new york illustrator design researcher visual systems designer content strategist wildlife conservation ecology'
    },
    {
      title: 'Resume',
      type: 'Page',
      snippet: 'Download resume, work experience, education, skills.',
      url: 'about.html#resume-section',
      searchText: 'resume cv download experience education skills work history graphic designer illustration'
    },
    {
      title: 'Community Engagement & Volunteerships',
      type: 'Page',
      snippet: 'Workshops, zine-making, dialogue facilitation, and volunteer work across NYC and Chennai.',
      url: 'about.html',
      searchText: 'community engagement volunteerships field meridians grey area collective lammeh nyc climate film festival pool governors island earth matter zine making nature journaling workshop decolonizing language'
    },
    {
      title: 'A Note on This Site',
      type: 'Page',
      snippet: 'Why the site looks and works the way it does.',
      url: 'about.html',
      searchText: 'note on this site design colors orange green pink india heritage data visualization interactive scratching cursor'
    },
    {
      title: 'Contact',
      type: 'Page',
      snippet: 'Email, LinkedIn, Instagram, or book a virtual coffee.',
      url: 'contact.html',
      searchText: 'contact email linkedin instagram virtual coffee jkarthik reach out get in touch'
    },
    {
      title: 'Visual Systems Designer Projects',
      type: 'Page',
      snippet: 'All projects filtered by visual systems design.',
      url: 'work-vd.html',
      searchText: 'visual systems designer projects grid role'
    },
    {
      title: 'Design Researcher Projects',
      type: 'Page',
      snippet: 'All projects filtered by design research.',
      url: 'work-dr.html',
      searchText: 'design researcher projects grid role'
    },
    {
      title: 'Content Strategist Projects',
      type: 'Page',
      snippet: 'All projects filtered by content strategy.',
      url: 'work-sms.html',
      searchText: 'content strategist projects grid role social media'
    }
  ];
  staticEntries.forEach(function(e) { e.searchText = e.searchText.toLowerCase(); });

  return entries.concat(staticEntries);
}

// Returns matches (title or searchText contains the query), title matches
// ranked first, capped to a reasonable number so the dropdown stays usable.
function runSearch(index, query) {
  var q = query.trim().toLowerCase();
  if (!q) return [];
  var titleMatches = [];
  var bodyMatches = [];
  index.forEach(function(entry) {
    if (entry.title.toLowerCase().indexOf(q) !== -1) {
      titleMatches.push(entry);
    } else if (entry.searchText.indexOf(q) !== -1) {
      bodyMatches.push(entry);
    }
  });
  return titleMatches.concat(bodyMatches).slice(0, 12);
}

// Wraps every case-insensitive occurrence of `query` in `text` with a <mark>
// for visible highlighting in the results dropdown.
function highlightMatch(text, query) {
  if (!query) return text;
  var escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var re = new RegExp('(' + escaped + ')', 'ig');
  return text.replace(re, '<mark>$1</mark>');
}
