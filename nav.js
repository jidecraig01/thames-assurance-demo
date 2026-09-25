/**
 * Thames Assurance — live demo navigation
 * Context-aware wiring for Beckton / Oxford / shared Map screens.
 * Prefers data-demo-nav / data-demo-site hooks; text-match fallback.
 */
(function () {
  'use strict';

  var file = (location.pathname.split('/').pop() || '').toLowerCase();

  var ROUTES = {
    login: '01-login-dark.html',
    map: '02-map-home.html',
    london: '03-region-sites.html',
    tv: '06-region-thames-valley.html',
    becktonGt: '04-site-dashboard-gt.html',
    oxfordGt: '05-oxford-dashboard-gt.html',
    ncr: '07-decision-ncr-00471.html',
    costain: '08-contractor-costain.html',
    cmdp: '09-contractor-cmdp.html',
    visualsB: '10-site-visuals-beckton.html',
    visualsO: '13-site-visuals-oxford.html',
    camB: '16-cam-detail-beckton.html',
    camO: '17-cam-detail-oxford.html',
    reportsB: '11-reports-beckton.html',
    previewB: '12-report-preview-beckton.html',
    reportsO: '14-reports-oxford.html',
    previewO: '15-report-preview-oxford.html',
    programmeB: '18-programme-beckton.html',
    programmeO: '19-programme-oxford.html',
    alertsB: '20-alerts-beckton.html',
    alertsO: '21-alerts-oxford.html',
    assuranceB: '22-assurance-beckton.html',
    assuranceO: '23-assurance-oxford.html'
  };

  function detectSite() {
    var bodySite = (document.body && document.body.getAttribute('data-demo-site')) || '';
    if (bodySite === 'oxford' || bodySite === 'beckton' || bodySite === 'shared') return bodySite;

    if (/oxford|cmdp|05-oxford|09-contractor|13-site|14-reports|15-report|17-cam|19-programme|21-alerts|23-assurance/.test(file)) {
      return 'oxford';
    }
    if (/beckton|costain|04-site|07-decision|08-contractor|10-site|11-reports|12-report|16-cam|18-programme|20-alerts|22-assurance/.test(file)) {
      return 'beckton';
    }

    var crumbs = textOf(document.querySelector('.crumbs'));
    if (/Oxford/i.test(crumbs)) return 'oxford';
    if (/Beckton/i.test(crumbs)) return 'beckton';
    return 'shared';
  }

  function site() {
    return detectSite();
  }

  function go(href, hash) {
    if (!href) return;
    location.href = href + (hash || '');
  }

  function mark(el) {
    if (!el) return;
    el.classList.add('demo-linked', 'demo-clickable');
  }

  function onClick(el, fn) {
    if (!el || el.__demoWired) return;
    el.__demoWired = true;
    mark(el);
    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      fn(e);
    });
  }

  function textOf(el) {
    return ((el && (el.textContent || '')) || '').replace(/\s+/g, ' ').trim();
  }

  function navKey(el) {
    if (!el) return '';
    var key = (el.getAttribute('data-demo-nav') || '').toLowerCase();
    if (key) return key;
    var t = textOf(el);
    if (/Site Dashboard/i.test(t)) return 'dashboard';
    if (/Overview\s*\/\s*Map/i.test(t) || /^Map$/i.test(t)) return 'map';
    if (/^Regions$/i.test(t)) return 'regions';
    if (/Site locations/i.test(t)) return 'sites';
    if (/Project team/i.test(t)) return 'team';
    if (/Site visuals/i.test(t)) return 'visuals';
    if (/^Programme$/i.test(t)) return 'programme';
    if (/^Assurance$/i.test(t)) return 'assurance';
    if (/^Reports$/i.test(t)) return 'reports';
    if (/^Alerts/i.test(t)) return 'alerts';
    if (/^Settings$/i.test(t)) return 'settings';
    if (/Log\s*out/i.test(t)) return 'logout';
    return '';
  }

  function siteRoutes(s) {
    var oxford = s === 'oxford';
    return {
      gt: oxford ? ROUTES.oxfordGt : ROUTES.becktonGt,
      visuals: oxford ? ROUTES.visualsO : ROUTES.visualsB,
      programme: oxford ? ROUTES.programmeO : ROUTES.programmeB,
      assurance: oxford ? ROUTES.assuranceO : ROUTES.assuranceB,
      reports: oxford ? ROUTES.reportsO : ROUTES.reportsB,
      alerts: oxford ? ROUTES.alertsO : ROUTES.alertsB,
      contractor: oxford ? ROUTES.cmdp : ROUTES.costain
    };
  }

  function handleRailNav(key) {
    var s = site();
    var r = siteRoutes(s === 'shared' ? 'beckton' : s);

    if (key === 'logout') {
      go(ROUTES.login);
      return true;
    }

    if (s === 'shared') {
      if (key === 'map') { go(ROUTES.map); return true; }
      if (key === 'regions') {
        if (file.indexOf('06-region') === 0) go(ROUTES.tv);
        else go(ROUTES.london);
        return true;
      }
      if (key === 'sites') {
        if (file.indexOf('06-region') === 0) go(ROUTES.tv);
        else go(ROUTES.london);
        return true;
      }
      // Map-level Programme / Assurance / Reports / Alerts → Beckton demo samples
      if (key === 'programme') { go(ROUTES.programmeB); return true; }
      if (key === 'assurance') { go(ROUTES.assuranceB); return true; }
      if (key === 'reports') { go(ROUTES.reportsB); return true; }
      if (key === 'alerts') { go(ROUTES.alertsB); return true; }
      if (key === 'settings') { return true; } // demo no-op
      if (key === 'dashboard' || key === 'team' || key === 'visuals') {
        go(ROUTES.becktonGt);
        return true;
      }
      return false;
    }

    // Site context (Beckton / Oxford) — full rail
    if (key === 'dashboard') { go(r.gt); return true; }
    if (key === 'map') { go(ROUTES.map); return true; }
    if (key === 'team') {
      if (/08-contractor|09-contractor/.test(file)) go(r.contractor);
      else go(r.gt, '#project-team');
      return true;
    }
    if (key === 'visuals') { go(r.visuals); return true; }
    if (key === 'programme') { go(r.programme); return true; }
    if (key === 'assurance') { go(r.assurance); return true; }
    if (key === 'reports') { go(r.reports); return true; }
    if (key === 'alerts') { go(r.alerts); return true; }
    return false;
  }

  function wireLogout() {
    document.querySelectorAll('.logout-btn, [data-demo-nav="logout"]').forEach(function (btn) {
      onClick(btn, function () { go(ROUTES.login); });
    });
  }

  function wireSiteRail() {
    document.querySelectorAll('.rail .nav-item, .rail .logout-btn').forEach(function (item) {
      var key = navKey(item);
      if (!key) return;
      if (key === 'settings') {
        mark(item);
        item.title = item.title || 'Demo settings (not wired)';
        return;
      }
      onClick(item, function () { handleRailNav(key); });
    });

    // Event delegation backup on rail (covers SVG/text click targets)
    var rail = document.querySelector('.rail');
    if (rail && !rail.__demoDelegated) {
      rail.__demoDelegated = true;
      rail.addEventListener('click', function (e) {
        var item = e.target && e.target.closest && e.target.closest('.nav-item, .logout-btn, [data-demo-nav]');
        if (!item || !rail.contains(item)) return;
        var key = navKey(item);
        if (!key || key === 'settings') return;
        if (item.__demoWired) return; // individual handler already fired (stopped)
        e.preventDefault();
        e.stopPropagation();
        handleRailNav(key);
      });
    }
  }

  function wireCrumbs() {
    var s = site();
    var crumbs = document.querySelector('.crumbs');
    if (!crumbs) return;

    crumbs.style.cursor = 'default';
    crumbs.addEventListener('click', function (e) {
      var target = e.target;
      var raw = textOf(target).replace(/\s*\/\s*/g, '').trim();

      if (/^Map( Home)?$/i.test(raw)) { go(ROUTES.map); return; }
      if (/Map/i.test(raw) && !/Beckton|Oxford|London|Thames|NCR|Reports|Assurance|Programme|Alerts|visuals|CAM/i.test(raw)) {
        go(ROUTES.map); return;
      }
      if (/^London$/i.test(raw)) { go(ROUTES.london); return; }
      if (/Thames Valley/i.test(raw)) { go(ROUTES.tv); return; }
      if (/Beckton/i.test(raw)) { go(ROUTES.becktonGt); return; }
      if (/Oxford/i.test(raw)) { go(ROUTES.oxfordGt); return; }
      if (/^Reports$/i.test(raw)) {
        go(s === 'oxford' ? ROUTES.reportsO : ROUTES.reportsB); return;
      }
      if (/Site visuals/i.test(raw)) {
        go(s === 'oxford' ? ROUTES.visualsO : ROUTES.visualsB); return;
      }
    });

    try {
      var mapLabel = crumbs.childNodes[0];
      if (mapLabel && mapLabel.nodeType === 3 && /Map/.test(mapLabel.textContent)) {
        var span = document.createElement('span');
        span.textContent = mapLabel.textContent.replace(/\s*$/, '');
        span.className = 'demo-crumb demo-linked';
        span.style.cursor = 'pointer';
        span.style.color = '#7DD3FC';
        span.addEventListener('click', function (e) {
          e.stopPropagation();
          go(ROUTES.map);
        });
        crumbs.replaceChild(span, mapLabel);
      }
      crumbs.querySelectorAll('span, b').forEach(function (el) {
        var t = textOf(el);
        if (/^London$/i.test(t)) {
          mark(el); el.style.cursor = 'pointer'; el.style.color = el.style.color || '#7DD3FC';
          onClick(el, function () { go(ROUTES.london); });
        } else if (/Thames Valley/i.test(t)) {
          mark(el); el.style.cursor = 'pointer';
          onClick(el, function () { go(ROUTES.tv); });
        } else if (/Beckton/i.test(t) && !/NCR|Reports|visuals|CAM|Programme|Alerts|Assurance/i.test(t)) {
          mark(el); el.style.cursor = 'pointer';
          onClick(el, function () { go(ROUTES.becktonGt); });
        } else if (/Oxford/i.test(t) && !/NCR|Reports|visuals|CAM|Programme|Alerts|Assurance/i.test(t)) {
          mark(el); el.style.cursor = 'pointer';
          onClick(el, function () { go(ROUTES.oxfordGt); });
        } else if (/^Reports$/i.test(t)) {
          mark(el); el.style.cursor = 'pointer';
          onClick(el, function () {
            go(s === 'oxford' ? ROUTES.reportsO : ROUTES.reportsB);
          });
        } else if (/Site visuals/i.test(t)) {
          mark(el); el.style.cursor = 'pointer';
          onClick(el, function () {
            go(s === 'oxford' ? ROUTES.visualsO : ROUTES.visualsB);
          });
        }
      });
    } catch (err) { /* ignore */ }
  }

  function wireLogin() {
    if (file.indexOf('01-login') !== 0) return;
    var btn = document.querySelector('.btn');
    onClick(btn, function () { go(ROUTES.map); });
    var sso = document.querySelector('.sso');
    onClick(sso, function () { go(ROUTES.map); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') go(ROUTES.map);
    });
  }

  function wireMapHome() {
    if (file.indexOf('02-map') !== 0) return;
    var cards = document.querySelector('.region-cards');
    if (cards) cards.classList.add('demo-interactive');
    document.querySelectorAll('.rcard.london').forEach(function (c) {
      onClick(c, function () { go(ROUTES.london); });
    });
    document.querySelectorAll('.rcard.tv').forEach(function (c) {
      onClick(c, function () { go(ROUTES.tv); });
    });

    // Leaflet polygons + Beckton/Oxford pins → regions / sites
    function attachMapClicks() {
      try {
        if (typeof L === 'undefined') return;
        var mapEl = document.getElementById('map');
        if (!mapEl) return;
        // Walk Leaflet layers via map instance stored on DOM
        var id = mapEl._leaflet_id;
        if (!id || !window.L || !L.Map) return;
        var map;
        // Leaflet keeps maps in an internal registry; fall back to scanning
        Object.keys(mapEl).some(function (k) {
          if (k.indexOf('leaflet') === 0) return false;
          return false;
        });
        // Prefer documented approach: find map from panes
        if (mapEl._leaflet) map = mapEl._leaflet;
        // Use L.DomEvent on existing paths
        var paths = mapEl.querySelectorAll('path.leaflet-interactive, .leaflet-interactive');
        // Polygons may not be interactive yet — make region polygons clickable via map click + hit
        // Simpler: re-query leaflet layers if map ref available through _leaflet_id map bookkeeping
        var maps = [];
        if (L.Map && L.Map.prototype) {
          // Iterate all map containers
          document.querySelectorAll('.leaflet-container').forEach(function (el) {
            if (el._leaflet_id && window[el._leaflet_id]) { /* noop */ }
          });
        }
        // Robust approach: enable clicks on SVG paths in order (london then tv then guildford)
        var svgPaths = mapEl.querySelectorAll('.leaflet-overlay-pane path');
        if (svgPaths && svgPaths.length) {
          // First large cyan-ish path ≈ London, teal ≈ TV (fill set in page script)
          Array.prototype.forEach.call(svgPaths, function (path, idx) {
            path.style.cursor = 'pointer';
            path.classList.add('demo-clickable');
            path.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              // Heuristic: first path London, second TV, third Guildford→TV
              if (idx === 0) go(ROUTES.london);
              else go(ROUTES.tv);
            });
          });
        }
        // Pin labels: make Beckton / Oxford pin wraps clickable
        mapEl.querySelectorAll('.pin-wrap').forEach(function (wrap) {
          var label = textOf(wrap.querySelector('.pin-label')) || textOf(wrap);
          if (/Beckton/i.test(label)) {
            wrap.style.cursor = 'pointer';
            wrap.style.pointerEvents = 'auto';
            onClick(wrap, function () { go(ROUTES.becktonGt); });
          } else if (/Oxford/i.test(label)) {
            wrap.style.cursor = 'pointer';
            wrap.style.pointerEvents = 'auto';
            onClick(wrap, function () { go(ROUTES.oxfordGt); });
          }
        });
      } catch (e) { /* ignore */ }
    }
    setTimeout(attachMapClicks, 600);
    setTimeout(attachMapClicks, 1600);
  }

  function wireRegionLondon() {
    if (file.indexOf('03-region') !== 0) return;
    document.querySelectorAll('.srow').forEach(function (row) {
      var name = textOf(row.querySelector('.name'));
      if (/Beckton/i.test(name)) {
        onClick(row, function () { go(ROUTES.becktonGt); });
      }
    });
    document.querySelectorAll('.viewall').forEach(function (el) {
      onClick(el, function () { go(ROUTES.becktonGt); });
    });
  }

  function wireRegionTV() {
    if (file.indexOf('06-region') !== 0) return;
    document.querySelectorAll('.srow').forEach(function (row) {
      var name = textOf(row.querySelector('.name'));
      if (/Oxford/i.test(name)) {
        onClick(row, function () { go(ROUTES.oxfordGt); });
      }
    });
    document.querySelectorAll('.viewall').forEach(function (el) {
      onClick(el, function () { go(ROUTES.oxfordGt); });
    });
  }

  function ensureProjectTeamId() {
    var candidates = document.querySelectorAll('h2, h3, .sec-label, .section-title, .panel-title');
    candidates.forEach(function (el) {
      if (/Project team/i.test(textOf(el))) {
        var section = el.closest('.panel, .card, .team, .section, .block') || el.parentElement;
        if (section && !section.id) section.id = 'project-team';
      }
    });
    var person = document.querySelector('.person');
    if (person && !document.getElementById('project-team')) {
      var wrap = person.closest('.panel, .card, .team, section, .block') || person.parentElement;
      if (wrap) wrap.id = 'project-team';
    }
    if (location.hash === '#project-team') {
      setTimeout(function () {
        var t = document.getElementById('project-team');
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }

  function wireBecktonGt() {
    if (file.indexOf('04-site') !== 0) return;
    ensureProjectTeamId();
    document.querySelectorAll('.dcard').forEach(function (card) {
      if (/NCR-00471/i.test(textOf(card))) {
        onClick(card, function () { go(ROUTES.ncr); });
      }
    });
    document.querySelectorAll('.t, .title, .id').forEach(function (el) {
      if (/^NCR-00471$/i.test(textOf(el))) {
        var card = el.closest('.dcard, .queue-row, .ncr-row, tr, .row') || el.parentElement;
        onClick(card, function () { go(ROUTES.ncr); });
      }
    });
    document.querySelectorAll('.person.clickable, .person').forEach(function (p) {
      if (/Costain/i.test(textOf(p)) || /Open Costain/i.test(p.getAttribute('title') || '')) {
        onClick(p, function () { go(ROUTES.costain); });
      }
    });
  }

  function wireOxfordGt() {
    if (file.indexOf('05-oxford') !== 0) return;
    ensureProjectTeamId();
    document.querySelectorAll('.person.clickable, .person').forEach(function (p) {
      if (/CMDP/i.test(textOf(p)) || /Open CMDP/i.test(p.getAttribute('title') || '')) {
        onClick(p, function () { go(ROUTES.cmdp); });
      }
    });
  }

  function wireNcr() {
    if (file.indexOf('07-decision') !== 0) return;
    document.querySelectorAll('.btn-ghost').forEach(function (btn) {
      if (/Back/i.test(textOf(btn))) {
        onClick(btn, function () { go(ROUTES.becktonGt); });
      }
    });
  }

  function wireContractor() {
    if (file.indexOf('08-contractor') === 0) {
      document.querySelectorAll('.btn-ghost, .rm').forEach(function (btn) {
        if (/Back/i.test(textOf(btn))) {
          onClick(btn, function () { go(ROUTES.becktonGt); });
        }
      });
    }
    if (file.indexOf('09-contractor') === 0) {
      document.querySelectorAll('.btn-ghost, .rm').forEach(function (btn) {
        if (/Back/i.test(textOf(btn))) {
          onClick(btn, function () { go(ROUTES.oxfordGt); });
        }
      });
    }
  }

  function wireVisuals() {
    if (file.indexOf('10-site-visuals') === 0) {
      document.querySelectorAll('.cam-tile, .tile').forEach(function (card) {
        if (/Closer look|CAM-BKT-02/i.test(textOf(card))) {
          onClick(card, function () { go(ROUTES.camB); });
        }
      });
      document.querySelectorAll('.cam-hint').forEach(function (hint) {
        if (/Closer look/i.test(textOf(hint))) {
          var card = hint.closest('.cam-tile, .tile, [class*="cam"]') || hint.parentElement;
          onClick(card, function () { go(ROUTES.camB); });
        }
      });
    }
    if (file.indexOf('13-site-visuals') === 0) {
      document.querySelectorAll('.cam-hint').forEach(function (hint) {
        if (/Closer look/i.test(textOf(hint))) {
          var card = hint.closest('.cam-tile, .tile, [class*="cam"]') || hint.parentElement;
          onClick(card, function () { go(ROUTES.camO); });
        }
      });
      document.querySelectorAll('.cam-tile, .tile').forEach(function (card) {
        if (/CAM-OXF-02|Closer look/i.test(textOf(card))) {
          onClick(card, function () { go(ROUTES.camO); });
        }
      });
    }
  }

  function wireCamDetail() {
    if (file.indexOf('16-cam') === 0) {
      document.querySelectorAll('.btn-ghost, .back-btn').forEach(function (btn) {
        if (/Back/i.test(textOf(btn))) {
          onClick(btn, function () { go(ROUTES.visualsB); });
        }
      });
    }
    if (file.indexOf('17-cam') === 0) {
      document.querySelectorAll('.btn-ghost, .back-btn').forEach(function (btn) {
        if (/Back/i.test(textOf(btn))) {
          onClick(btn, function () { go(ROUTES.visualsO); });
        }
      });
    }
  }

  function wireReports() {
    if (file.indexOf('11-reports') === 0) {
      document.querySelectorAll('.btn-open').forEach(function (btn) {
        onClick(btn, function () { go(ROUTES.previewB); });
        var row = btn.closest('.row, .rrow, .report-row, tr, .card, .item');
        if (row) onClick(row, function () { go(ROUTES.previewB); });
      });
    }
    if (file.indexOf('14-reports') === 0) {
      document.querySelectorAll('.btn-open').forEach(function (btn) {
        onClick(btn, function () { go(ROUTES.previewO); });
        var row = btn.closest('.row, .rrow, .report-row, tr, .card, .item');
        if (row) onClick(row, function () { go(ROUTES.previewO); });
      });
    }
    if (file.indexOf('12-report-preview') === 0) {
      document.querySelectorAll('.btn-ghost').forEach(function (btn) {
        if (/Back/i.test(textOf(btn))) {
          onClick(btn, function () { go(ROUTES.reportsB); });
        }
      });
    }
    if (file.indexOf('15-report-preview') === 0) {
      document.querySelectorAll('.btn-ghost').forEach(function (btn) {
        if (/Back/i.test(textOf(btn))) {
          onClick(btn, function () { go(ROUTES.reportsO); });
        }
      });
    }
  }

  function wireAssurance() {
    if (file.indexOf('22-assurance') === 0 || file.indexOf('23-assurance') === 0) {
      document.querySelectorAll('*').forEach(function (el) {
        if (el.children && el.children.length > 6) return;
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
        var t = textOf(el);
        if (/NCR-00471/i.test(t) && t.length < 120) {
          var row = el.closest('.queue-row, .ncr-row, .row, .item, .card, li, tr') || el;
          if (row && !row.__ncrWired) {
            row.__ncrWired = true;
            onClick(row, function () { go(ROUTES.ncr); });
          }
        }
      });
    }
  }

  function addDemoBadge() {
    if (document.querySelector('.demo-badge')) return;
    var b = document.createElement('div');
    b.className = 'demo-badge';
    b.textContent = 'Live demo';
    document.documentElement.classList.add('live-demo-shell');
    document.body.appendChild(b);
  }

  function init() {
    addDemoBadge();
    wireLogout();
    wireSiteRail();
    wireCrumbs();
    wireLogin();
    wireMapHome();
    wireRegionLondon();
    wireRegionTV();
    wireBecktonGt();
    wireOxfordGt();
    wireNcr();
    wireContractor();
    wireVisuals();
    wireCamDetail();
    wireReports();
    wireAssurance();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
