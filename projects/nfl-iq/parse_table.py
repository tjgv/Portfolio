#!/usr/bin/env python3
"""
Read paste.html: find QuickSight / sn-table cells (data-row-path + data-col-path),
take the display value from aria-label (or title as fallback), and emit JSON.

Default layout matches Amazon QuickSight \"Scouting Combine\" style exports where
column indices are 0=rank ... 20=wing (see COL_QUICKSIGHT).
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import re
from collections import defaultdict
from typing import Any, Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# QuickSight combine table (data-col-path on each .cell)
# ---------------------------------------------------------------------------
COL_QUICKSIGHT: Dict[int, str] = {
    0: "rank",
    1: "name",
    2: "schoolLogoUrl",
    3: "pos",
    4: "fortyMph",
    5: "fortyTime",
    6: "tenYd",
    7: "broad",
    8: "vert",
    9: "shuttle",
    10: "cone",
    11: "bench",
    12: "rawAth",
    13: "athleticism",
    14: "production",
    15: "overall",
    16: "ht",
    17: "wt",
    18: "hand",
    19: "arm",
    20: "wing",
}

# Legacy 9-field projection (only used with --layout legacy)
COL_LEGACY: Dict[int, str] = {
    8: "name",
    0: "pos",
    1: "school",
    2: "rank",
    3: "overall",
    4: "athleticism",
    5: "athleticismRank",
    6: "production",
    7: "productionRank",
}

DIV_OPEN = re.compile(r"<div\b[^>]*>", re.IGNORECASE)
ATTR_ROW = re.compile(r'data-row-path\s*=\s*"([^"]*)"')
ATTR_COL = re.compile(r'data-col-path\s*=\s*"(\d+)"')
LOGO_URL = re.compile(
    r"https://ngs\.nfl\.com/public/img/college-team-logos/([^/?#]+)\.png",
    re.I,
)


def attr_value(tag: str, name: str) -> Optional[str]:
    """Extract a double-quoted HTML attribute value (handles &quot; inside)."""
    prefix = f'{name}="'
    i = tag.find(prefix)
    if i < 0:
        return None
    i += len(prefix)
    buf: List[str] = []
    while i < len(tag):
        if tag[i] == '"':
            break
        buf.append(tag[i])
        i += 1
    raw = "".join(buf)
    return html_lib.unescape(raw)


def is_data_cell_tag(tag: str) -> bool:
    if "data-row-path" not in tag or "data-col-path" not in tag:
        return False
    if "cell-drag-handler" in tag:
        return False
    if "fixed-header-selection-indicator" in tag and "cell" not in tag:
        return False
    if 'data-automation-id="sn-table-cell-' in tag:
        return True
    if re.search(r'class="[^"]*\bcell\b', tag):
        return True
    return False


def parse_cell(tag: str) -> Optional[Tuple[str, int, str]]:
    """Return (row_path, col_path, raw_cell_value) or None."""
    row_m = ATTR_ROW.search(tag)
    col_m = ATTR_COL.search(tag)
    if not (row_m and col_m):
        return None
    row_path = row_m.group(1)
    col_path = int(col_m.group(1))

    val = attr_value(tag, "aria-label")
    if not val:
        val = attr_value(tag, "title")
    if val is None:
        val = ""

    return row_path, col_path, val


def normalize_school_fields(rec: Dict[str, Any]) -> None:
    """Derive school + schoolAbbr from NFL logo URL in schoolLogoUrl."""
    url = rec.get("schoolLogoUrl") or ""
    if not isinstance(url, str) or not url.startswith("http"):
        rec.setdefault("school", "")
        rec.setdefault("schoolAbbr", "")
        return
    m = LOGO_URL.search(url)
    if m:
        slug = m.group(1).upper()
        rec["schoolAbbr"] = slug
        rec["school"] = slug.replace("_", " ")
    else:
        rec.setdefault("school", "")
        rec.setdefault("schoolAbbr", "")


def normalize_rank(rec: Dict[str, Any]) -> None:
    r = rec.get("rank", "")
    if isinstance(r, str) and r.startswith("#"):
        rec["rank"] = r.lstrip("#").strip()


def extract_rows(
    page: str,
    col_map: Dict[int, str],
    layout: str,
) -> Dict[str, Dict[str, Any]]:
    row_map: Dict[str, Dict[str, Any]] = defaultdict(dict)

    for m in DIV_OPEN.finditer(page):
        tag = m.group(0)
        if not is_data_cell_tag(tag):
            continue
        parsed = parse_cell(tag)
        if parsed is None:
            continue
        row_path, col_path, raw = parsed
        field = col_map.get(col_path)
        if field is None:
            continue
        row_map[row_path][field] = raw

    if layout == "quicksight":
        for rec in row_map.values():
            normalize_school_fields(rec)
            normalize_rank(rec)

    return row_map


def sort_key_row_path(path: str) -> Tuple:
    try:
        return (0, int(path))
    except ValueError:
        return (1, path)


def records_quicksight(rows: Dict[str, Dict[str, Any]]) -> List[Dict[str, Any]]:
    field_order = list(COL_QUICKSIGHT.values()) + ["school", "schoolAbbr"]
    seen = set()
    ordered_fields: List[str] = []
    for f in field_order:
        if f not in seen:
            seen.add(f)
            ordered_fields.append(f)

    out: List[Dict[str, Any]] = []
    for path in sorted(rows.keys(), key=sort_key_row_path):
        src = rows[path]
        rec: Dict[str, Any] = {}
        for k in ordered_fields:
            rec[k] = src.get(k, "")
        out.append(rec)
    return out


def records_legacy(rows: Dict[str, Dict[str, Any]]) -> List[Dict[str, str]]:
    field_order = list(COL_LEGACY.values())
    out: List[Dict[str, str]] = []
    for path in sorted(rows.keys(), key=sort_key_row_path):
        src = rows[path]
        rec = {k: str(src.get(k, "") or "") for k in field_order}
        out.append(rec)
    return out


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Parse QuickSight-style paste.html table cells into JSON (aria-label).",
    )
    parser.add_argument(
        "-i",
        "--input",
        default="paste.html",
        help="Input HTML file (default: paste.html)",
    )
    parser.add_argument(
        "-o",
        "--output",
        default="parsed_table.json",
        help="Output JSON file (default: parsed_table.json)",
    )
    parser.add_argument(
        "--layout",
        choices=("quicksight", "legacy"),
        default="quicksight",
        help="quicksight: NFL combine 21-col grid (default). legacy: original 9-field map.",
    )
    args = parser.parse_args()

    with open(args.input, encoding="utf-8") as f:
        page = f.read()

    col_map = COL_QUICKSIGHT if args.layout == "quicksight" else COL_LEGACY
    rows = extract_rows(page, col_map, args.layout)

    if args.layout == "quicksight":
        records: Any = records_quicksight(rows)
    else:
        records = records_legacy(rows)

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"Wrote {len(records)} rows to {args.output}")


if __name__ == "__main__":
    main()
