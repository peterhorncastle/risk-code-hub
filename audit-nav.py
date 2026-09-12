#!/usr/bin/env python3
"""
Audit every Risk Code Hub page against the nav spec documented in _template.html.

Reports deviations only. Read-only - changes nothing.

Canonical spec source: the NAV TABS block of _template.html, which states
"Tab labels are standard across all hubs - do NOT rename them" and
"do NOT write structural CSS inline". This script enforces exactly that.

Usage:
    python audit-nav.py                     # summary grouped by defect
    python audit-nav.py --csv findings.csv  # per-page findings as CSV
    python audit-nav.py --gate              # exit 1 if any BREAKS-level finding
"""
import json
import re
import sys
import csv
import os
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.abspath(__file__))

# Severity drives the exit code so this can gate a commit.
# BREAKS = renders visibly wrong for a reader.
# DRIFT  = inconsistent but readable.
# DEBT   = invisible to readers; a maintenance risk only.
SEVERITY = {
    'HUB_MISSING':               'BREAKS',
    'PAGE_MISSING':              'BREAKS',
    'NO_NAV':                    'BREAKS',
    'NAV_USES_UL':               'BREAKS',
    'LINKS_ORPHANED_OUTSIDE_UL': 'BREAKS',
    'NO_SHARED_CSS':             'BREAKS',
    'TABS_MISSING':              'DRIFT',
    'TABS_EXTRA':                'DRIFT',
    'TABS_OUT_OF_ORDER':         'DRIFT',
    'LABEL_DRIFT':               'DRIFT',
    'NO_ACTIVE_TAB':             'DRIFT',
    'MULTIPLE_ACTIVE':           'DRIFT',
    'WRONG_ACTIVE_TAB':          'DRIFT',
    'NO_FOOTER_BACKLINK':        'DRIFT',
    'INLINE_NAV_CSS':            'DEBT',
}

# ---------------------------------------------------------------------------
# Canonical spec, taken verbatim from _template.html's NAV TABS block.
# (href, label) in required order. Programme Builder href varies by risk code.
# ---------------------------------------------------------------------------
CANON = [
    ("overview.html",        "Overview"),
    ("history.html",         "History"),
    ("timeline.html",        "Timeline"),
    ("database.html",        "Loss Database"),
    ("underwriting.html",    "Underwriting"),
    ("rates-analysis.html",  "Rates & ROE"),
    ("risk-mitigation.html", "Risk Mitigation"),
    ("global-program.html",  "Global Programme"),
    ("references.html",      "References"),
    ("rater.html",           "Rater"),
    ("PROGRAMME_BUILDER",    "Programme Builder"),
]
CANON_HREFS = [h for h, _ in CANON]
PAGES = [h for h in CANON_HREFS if h.endswith('.html')]

PB_RE = re.compile(r'\.\./programme-builder\.html\?code=', re.I)


def norm(s):
    """Collapse whitespace and decode the few entities that appear in labels."""
    s = re.sub(r'<[^>]+>', '', s)
    s = (s.replace('&amp;', '&').replace('&nbsp;', ' ')
          .replace('&rsquo;', "'").replace('&#39;', "'"))
    return re.sub(r'\s+', ' ', s).strip()


def parse(path):
    html = open(path, encoding='utf8', errors='ignore').read()
    nav = re.search(r'<nav\b[^>]*>(.*?)</nav>', html, re.S)
    out = {
        'has_nav': nav is not None,
        'has_ul': False,
        'links_outside_ul': 0,
        'links': [],
        'active': [],
        'links_shared_css': 'hub-styles.css' in html,
        'inline_nav_css': False,
        'has_footer_backlink': False,
    }
    # inline structural nav CSS (the thing _template.html forbids)
    style = re.findall(r'<style\b[^>]*>(.*?)</style>', html, re.S)
    joined = '\n'.join(style)
    if re.search(r'\bnav\s+(ul|li)\b', joined) or re.search(r'^\s*nav\s*\{', joined, re.M):
        out['inline_nav_css'] = True

    foot = re.search(r'<footer\b.*?</footer>', html, re.S)
    if foot and re.search(r'href=["\'](\.\./)?index\.html', foot.group(0)):
        out['has_footer_backlink'] = True

    if not nav:
        return out
    inner = nav.group(1)
    out['has_ul'] = '<ul' in inner.lower()

    # every anchor inside nav, in document order
    for m in re.finditer(r'<a\b([^>]*)>(.*?)</a>', inner, re.S):
        attrs, text = m.group(1), norm(m.group(2))
        href = re.search(r'href=["\']([^"\']*)["\']', attrs)
        href = href.group(1) if href else ''
        key = 'PROGRAMME_BUILDER' if PB_RE.match(href) else href
        out['links'].append((key, text, m.start()))
        if 'active' in attrs:
            out['active'].append(key)

    if out['has_ul']:
        # anchors positioned after the UL closes are orphans: no CSS rule matches them
        ul = re.search(r'<ul\b.*?</ul>', inner, re.S)
        if ul:
            out['links_outside_ul'] = sum(1 for _, _, p in out['links'] if p > ul.end())
    return out


def audit():
    # A hub's FOLDER comes from the 'url' field, not 'id' - for 9 hubs they
    # deliberately differ (id="pi-legal" -> url="pi-eo/overview.html"), and two
    # ids can share one folder (pi-legal + pi-accountants -> pi-eo).
    idx = json.load(open(os.path.join(ROOT, 'hub-index.json'), encoding='utf8'))
    hubs = sorted({h['url'].split('/')[0] for h in idx})
    findings = []   # (hub, page, code, detail)
    scanned = 0

    for hub in hubs:
        hdir = os.path.join(ROOT, hub)
        if not os.path.isdir(hdir):
            findings.append((hub, '-', 'HUB_MISSING', 'folder not found'))
            continue
        for page in PAGES:
            fp = os.path.join(hdir, page)
            if not os.path.exists(fp):
                findings.append((hub, page, 'PAGE_MISSING', 'file not found'))
                continue
            scanned += 1
            r = parse(fp)

            if not r['has_nav']:
                findings.append((hub, page, 'NO_NAV', 'no <nav> element'))
                continue
            if r['has_ul']:
                findings.append((hub, page, 'NAV_USES_UL',
                                 'nav wraps links in <ul>/<li>; hub-styles.css only styles "nav a"'))
            if r['links_outside_ul']:
                findings.append((hub, page, 'LINKS_ORPHANED_OUTSIDE_UL',
                                 '%d link(s) sit outside the <ul> and match no CSS rule'
                                 % r['links_outside_ul']))
            if not r['links_shared_css']:
                findings.append((hub, page, 'NO_SHARED_CSS', 'hub-styles.css not linked'))
            if r['inline_nav_css']:
                findings.append((hub, page, 'INLINE_NAV_CSS',
                                 'page redefines nav layout inline (template forbids)'))
            if not r['has_footer_backlink']:
                findings.append((hub, page, 'NO_FOOTER_BACKLINK', 'no index.html link in <footer>'))

            got_hrefs = [k for k, _, _ in r['links']]
            missing = [h for h in CANON_HREFS if h not in got_hrefs]
            if missing:
                findings.append((hub, page, 'TABS_MISSING', ', '.join(missing)))
            extra = [h for h in got_hrefs if h not in CANON_HREFS]
            if extra:
                findings.append((hub, page, 'TABS_EXTRA', ', '.join(sorted(set(extra)))))

            # ordering, judged only on the tabs actually present
            seq = [h for h in got_hrefs if h in CANON_HREFS]
            expect = [h for h in CANON_HREFS if h in seq]
            if seq != expect:
                findings.append((hub, page, 'TABS_OUT_OF_ORDER', ' | '.join(seq)))

            # labels
            canon_label = dict(CANON)
            for k, text, _ in r['links']:
                if k in canon_label and text != canon_label[k]:
                    findings.append((hub, page, 'LABEL_DRIFT',
                                     '%s: "%s" (expected "%s")' % (k, text, canon_label[k])))

            # active state
            if len(r['active']) == 0:
                findings.append((hub, page, 'NO_ACTIVE_TAB', 'no link marked class="active"'))
            elif len(r['active']) > 1:
                findings.append((hub, page, 'MULTIPLE_ACTIVE', ', '.join(r['active'])))
            elif r['active'][0] != page:
                findings.append((hub, page, 'WRONG_ACTIVE_TAB',
                                 'active=%s on page %s' % (r['active'][0], page)))
    return hubs, scanned, findings


def main():
    hubs, scanned, findings = audit()

    print("Risk Code Hub - nav & structure audit")
    print("=" * 74)
    print("hubs in hub-index.json : %d" % len(hubs))
    print("pages scanned          : %d" % scanned)
    print("findings               : %d" % len(findings))
    print()

    by_code = Counter(f[2] for f in findings)
    print("%-28s %-7s %6s   %s" % ("DEFECT", "SEV", "COUNT", "HUBS AFFECTED"))
    print("-" * 74)
    for sev in ('BREAKS', 'DRIFT', 'DEBT'):
        for code, n in by_code.most_common():
            if SEVERITY.get(code) != sev:
                continue
            hubs_hit = sorted({f[0] for f in findings if f[2] == code})
            shown = ', '.join(hubs_hit[:3]) + (' +%d more' % (len(hubs_hit) - 3)
                                               if len(hubs_hit) > 3 else '')
            print("%-28s %-7s %6d   %s" % (code, sev, n, shown))
    print()
    sev_totals = Counter(SEVERITY.get(f[2], 'DRIFT') for f in findings)
    print("by severity: BREAKS=%d  DRIFT=%d  DEBT=%d"
          % (sev_totals['BREAKS'], sev_totals['DRIFT'], sev_totals['DEBT']))
    print()

    clean_pages = defaultdict(set)
    for f in findings:
        clean_pages[f[0]].add(f[1])
    dirty_hubs = {f[0] for f in findings}
    print("hubs fully clean : %d of %d" % (len(hubs) - len(dirty_hubs), len(hubs)))
    print("hubs with issues : %d" % len(dirty_hubs))
    print()
    print("Worst hubs by affected pages:")
    for hub, pgs in sorted(clean_pages.items(), key=lambda kv: -len(kv[1]))[:12]:
        codes = sorted({f[2] for f in findings if f[0] == hub})
        print("  %-32s %2d pages   %s" % (hub, len(pgs), ', '.join(codes)))

    if '--csv' in sys.argv:
        out = sys.argv[sys.argv.index('--csv') + 1]
        with open(out, 'w', newline='', encoding='utf8') as fh:
            w = csv.writer(fh)
            w.writerow(['severity', 'hub', 'page', 'defect', 'detail'])
            w.writerows([(SEVERITY.get(f[2], 'DRIFT'),) + f for f in findings])
        print("per-page findings written to %s" % out)

    # Exit non-zero only on BREAKS, so this can gate a commit without the
    # (large, cosmetic) drift backlog blocking every commit.
    if '--gate' in sys.argv and sev_totals['BREAKS']:
        print("\nGATE FAILED: %d BREAKS-level finding(s)" % sev_totals['BREAKS'])
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
