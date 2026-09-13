import os
import re
import json
from pathlib import Path
from bs4 import BeautifulSoup

ROOT_DIR = Path("/home/axz01/webbelajardadakan/src/assets/materials")

def inspect_file(filepath):
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    soup = BeautifulSoup(content, "html.parser")

    pages = soup.find_all("div", class_=lambda c: c and "page" in c.split())
    text_elements = soup.find_all("div", class_=lambda c: c and "t" in c.split())
    imgs = soup.find_all("img")
    tables = soup.find_all("table")
    svgs = soup.find_all("svg")

    # Collect classes used in text divs
    t_classes = set()
    for t in text_elements:
        for cl in t.get("class", []):
            if cl != "t":
                t_classes.add(cl)

    # Check for fixed-layout indicators
    has_matrix = "matrix(" in content
    has_page_class = len(pages) > 0
    has_fixed_dims = bool(re.search(r"width\s*:\s*\d+px", content))
    is_fixed_layout = has_matrix or has_page_class or has_fixed_dims

    raw_text = soup.get_text()
    has_formula = any(sig in content or sig in raw_text for sig in ["\\frac", "\\sqrt", "→", "⇌", "sin(", "cos(", "tan(", "θ", "π", "α", "β", "Δ", "sub>", "sup>"]) or bool(re.search(r"\b(sin|cos|tan|sec|csc|cot)\s*[A-Z0-9\(\θ\α]", raw_text, re.I))

    # Check for lists
    list_signals = bool(re.search(r"(?:^|\n|\s)(?:[•●○\-\–]|\d+[\.\)]|[a-zA-Z][\.\)])\s+[A-Za-z]", raw_text))

    # Check for headings
    h_tags = soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"])
    has_explicit_heading = len(h_tags) > 0
    style_content = "\n".join([s.get_text() for s in soup.find_all("style")])
    font_sizes = [float(x) for x in re.findall(r"font-size\s*:\s*([\d.]+)px", style_content)]
    has_heading = has_explicit_heading or (len(font_sizes) > 0 and max(font_sizes) >= 16)

    # Check for visual tables
    has_visual_table = len(tables) > 0 or ("line" in content and "svg" in content) or bool(re.search(r"border-(?:top|bottom|left|right)", content))

    return {
        "file": str(filepath.relative_to(ROOT_DIR)),
        "abs_path": str(filepath),
        "file_size_bytes": len(content),
        "pages_count": len(pages),
        "text_elements_count": len(text_elements),
        "img_count": len(imgs),
        "table_count": len(tables),
        "svg_count": len(svgs),
        "unique_text_classes_count": len(t_classes),
        "is_fixed_layout": is_fixed_layout,
        "has_formula": has_formula,
        "has_visual_table": has_visual_table,
        "has_list": list_signals,
        "has_heading": has_heading,
        "max_font_size": max(font_sizes) if font_sizes else None,
        "min_font_size": min(font_sizes) if font_sizes else None,
        "font_sizes_found": sorted(list(set(font_sizes))) if font_sizes else []
    }

def main():
    html_files = sorted(ROOT_DIR.rglob("*.html"))
    html_files = [f for f in html_files if "converted" not in f.parts]
    
    inventory = []
    for hf in html_files:
        info = inspect_file(hf)
        inventory.append(info)
    
    print(json.dumps(inventory, indent=2))

if __name__ == "__main__":
    main()
