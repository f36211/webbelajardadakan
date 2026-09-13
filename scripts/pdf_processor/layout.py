"""
layout.py — Layout analysis: groups text items into visual lines and blocks.
Determines line boundaries, paragraph breaks, and spatial grouping.
"""
from typing import List, Dict, Tuple
from collections import defaultdict
from extractor import TextItem, PageData


class VisualLine:
    """A single visual line (same Y-level) of text."""
    def __init__(self, items: List[TextItem]):
        self.items = sorted(items, key=lambda i: i.x0)
        self.y0 = min(i.y0 for i in items)
        self.y1 = max(i.y1 for i in items)
        self.x0 = min(i.x0 for i in items)
        self.x1 = max(i.x1 for i in items)
        self.page_num = items[0].page_num if items else 0

    @property
    def text(self) -> str:
        return ''.join(i.text for i in self.items)

    @property
    def font_size(self) -> float:
        if not self.items:
            return 0
        return max(i.font_size for i in self.items)

    @property
    def avg_font_size(self) -> float:
        if not self.items:
            return 0
        return sum(i.font_size for i in self.items) / len(self.items)

    @property
    def is_bold(self) -> bool:
        return any(i.bold for i in self.items)

    @property
    def height(self) -> float:
        return self.y1 - self.y0

    @property
    def bbox(self) -> List[float]:
        return [self.x0, self.y0, self.x1, self.y1]

    def to_dict(self) -> dict:
        return {
            'text': self.text,
            'y0': self.y0,
            'y1': self.y1,
            'x0': self.x0,
            'x1': self.x1,
            'font_size': self.font_size,
            'avg_font_size': self.avg_font_size,
            'bold': self.is_bold,
            'page': self.page_num,
        }


class LayoutBlock:
    """A block of related lines (paragraph, heading, etc.)."""
    def __init__(self, lines: List[VisualLine]):
        self.lines = lines
        self.y0 = min(l.y0 for l in lines) if lines else 0
        self.y1 = max(l.y1 for l in lines) if lines else 0
        self.page_num = lines[0].page_num if lines else 0

    @property
    def text(self) -> str:
        return '\n'.join(l.text for l in self.lines)

    @property
    def font_size(self) -> float:
        if not self.lines:
            return 0
        return self.lines[0].font_size  # First line's font size (usually heading font)

    @property
    def is_bold(self) -> bool:
        return any(l.is_bold for l in self.lines)

    @property
    def bbox(self) -> List[float]:
        if not self.lines:
            return [0, 0, 0, 0]
        return [self.lines[0].x0, self.y0, self.lines[-1].x1, self.y1]

    def to_dict(self) -> dict:
        return {
            'text': self.text[:200],
            'line_count': len(self.lines),
            'font_size': self.font_size,
            'bold': self.is_bold,
            'page': self.page_num,
        }


def group_items_into_lines(items: List[TextItem], y_tolerance: float = 3.0) -> List[VisualLine]:
    """
    Group text items into visual lines based on Y-coordinate.
    Items with similar Y positions are on the same line.
    """
    if not items:
        return []

    # Sort by Y, then by X
    sorted_items = sorted(items, key=lambda i: (round(i.y0 / y_tolerance) * y_tolerance, i.x0))

    lines: List[VisualLine] = []
    current_line_items: List[TextItem] = []
    current_y_bucket = None

    for item in sorted_items:
        y_bucket = round(item.y0 / y_tolerance) * y_tolerance
        if current_y_bucket is None:
            current_y_bucket = y_bucket
            current_line_items.append(item)
        elif abs(y_bucket - current_y_bucket) < y_tolerance:
            current_line_items.append(item)
        else:
            if current_line_items:
                lines.append(VisualLine(current_line_items))
            current_line_items = [item]
            current_y_bucket = y_bucket

    if current_line_items:
        lines.append(VisualLine(current_line_items))

    return lines


def group_lines_into_blocks(lines: List[VisualLine], page_height: float,
                             y_gap_multiplier: float = 2.5) -> List[LayoutBlock]:
    """
    Group visual lines into blocks based on vertical spacing.
    Lines with large gaps between them are in different blocks.
    """
    if not lines:
        return []

    blocks: List[LayoutBlock] = []
    current_block_lines: List[VisualLine] = []
    avg_line_height = 0
    line_count = 0

    for line in lines:
        if current_block_lines:
            last_line = current_block_lines[-1]
            gap = line.y0 - last_line.y1
            avg_line_height = (avg_line_height * line_count + last_line.height) / (line_count + 1) if line_count > 0 else last_line.height
            line_count += 1

            # Determine gap threshold
            threshold = avg_line_height * y_gap_multiplier

            if gap > threshold and gap > 12:
                # Significant gap — end current block
                blocks.append(LayoutBlock(current_block_lines))
                current_block_lines = [line]
            else:
                current_block_lines.append(line)
        else:
            current_block_lines.append(line)

    if current_block_lines:
        blocks.append(LayoutBlock(current_block_lines))

    return blocks


def analyze_layout(pages: List[PageData]) -> List[LayoutBlock]:
    """
    Full layout analysis: extract lines and blocks from all pages.
    Returns a flat list of blocks across all pages, maintaining page order.
    """
    all_blocks: List[LayoutBlock] = []

    for page in pages:
        if not page.items:
            continue

        lines = group_items_into_lines(page.items)
        blocks = group_lines_into_blocks(lines, page.height)
        all_blocks.extend(blocks)

    return all_blocks


def compute_font_distribution(blocks: List[LayoutBlock]) -> Dict[float, int]:
    """Count how many times each font size appears. Used for heading level inference."""
    distribution: Dict[float, int] = defaultdict(int)
    for block in blocks:
        if block.font_size > 0:
            distribution[block.font_size] += 1
    return dict(sorted(distribution.items(), key=lambda x: x[0], reverse=True))


def detect_body_font_size(blocks: List[LayoutBlock]) -> float:
    """Detect the most common body text font size (non-heading)."""
    distribution = compute_font_distribution(blocks)
    if not distribution:
        return 12.0

    # Body text is typically the most frequent font size
    # But exclude very large sizes (headings)
    body_sizes = {fs: count for fs, count in distribution.items() if fs < 20}
    if not body_sizes:
        return list(distribution.keys())[0]
    return max(body_sizes.items(), key=lambda x: x[1])[0]
