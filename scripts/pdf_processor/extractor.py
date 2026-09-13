"""
extractor.py — PyMuPDF-based PDF text and layout extraction.
Extracts text with positions, fonts, sizes, and colors for analysis.
"""
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional

# Try to import fitz (PyMuPDF)
try:
    import fitz
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False
    print("WARNING: PyMuPDF (fitz) not installed. Run: pip install pymupdf")


class TextItem:
    """Represents a single text span extracted from a PDF."""
    __slots__ = ('text', 'x0', 'y0', 'x1', 'y1', 'font_name', 'font_size',
                  'color', 'bold', 'italic', 'page_num', 'block_num', 'line_num')

    def __init__(self, text: str, x0: float, y0: float, x1: float, y1: float,
                 font_name: str, font_size: float, color: int,
                 page_num: int, block_num: int = 0, line_num: int = 0):
        self.text = text
        self.x0 = round(x0, 2)
        self.y0 = round(y0, 2)
        self.x1 = round(x1, 2)
        self.y1 = round(y1, 2)
        self.font_name = font_name or ""
        self.font_size = round(font_size, 2) if font_size else 0
        self.color = color or 0
        self.bold = self._is_bold(font_name)
        self.italic = self._is_italic(font_name)
        self.page_num = page_num
        self.block_num = block_num
        self.line_num = line_num

    @staticmethod
    def _is_bold(font_name: str) -> bool:
        if not font_name:
            return False
        fn = font_name.lower()
        return any(kw in fn for kw in ['bold', 'black', 'heavy', 'demi', 'semibold', 'ultralight'])

    @staticmethod
    def _is_italic(font_name: str) -> bool:
        if not font_name:
            return False
        fn = font_name.lower()
        return any(kw in fn for kw in ['italic', 'oblique', 'slanted', 'inclined'])

    @property
    def width(self) -> float:
        return round(self.x1 - self.x0, 2)

    @property
    def height(self) -> float:
        return round(self.y1 - self.y0, 2)

    @property
    def bbox(self) -> List[float]:
        return [self.x0, self.y0, self.x1, self.y1]

    def to_dict(self) -> dict:
        return {
            'text': self.text,
            'x0': self.x0, 'y0': self.y0,
            'x1': self.x1, 'y1': self.y1,
            'font': self.font_name,
            'size': self.font_size,
            'color': self.color,
            'bold': self.bold,
            'italic': self.italic,
            'page': self.page_num,
        }


class PageData:
    """All extracted data from a single PDF page."""
    def __init__(self, page_num: int, width: float, height: float,
                 items: List[TextItem], raw_text: str):
        self.page_num = page_num
        self.width = round(width, 2)
        self.height = round(height, 2)
        self.items = items
        self.raw_text = raw_text

    def to_dict(self) -> dict:
        return {
            'page_num': self.page_num,
            'width': self.width,
            'height': self.height,
            'item_count': len(self.items),
            'text_sample': self.raw_text[:200] if self.raw_text else "",
        }


class PDFExtractor:
    """Extracts text and layout information from a PDF using PyMuPDF."""

    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.doc: Optional[Any] = None
        self.pages: List[PageData] = []
        self._load()

    def _load(self):
        if not PYMUPDF_AVAILABLE:
            return
        try:
            self.doc = fitz.open(self.pdf_path)
        except Exception as e:
            print(f"ERROR opening {self.pdf_path}: {e}")
            self.doc = None

    def extract(self) -> List[PageData]:
        """Extract text and layout from all pages."""
        if not self.doc:
            return []

        self.pages = []
        for page_num in range(len(self.doc)):
            page = self.doc[page_num]
            page_data = self._extract_page(page, page_num + 1)
            self.pages.append(page_data)

        return self.pages

    def _extract_page(self, page: Any, page_num: int) -> PageData:
        """Extract from a single page."""
        rect = page.rect
        width = rect.width
        height = rect.height

        items: List[TextItem] = []
        block_num = 0

        # Get text with full layout information
        text_page = page.get_textpage()
        blocks = page.get_text("dict")  # Full dict with blocks

        if 'blocks' in blocks:
            for block in blocks['blocks']:
                if block.get('type') == 0:  # Text block
                    block_num += 1
                    for line in block.get('lines', []):
                        line_num = 0
                        for span in line.get('spans', []):
                            line_num += 1
                            text = span.get('text', '').strip()
                            if not text:
                                continue

                            x0 = span.get('bbox', [0, 0, 0, 0])[0]
                            y0 = span.get('bbox', [0, 0, 0, 0])[1]
                            x1 = span.get('bbox', [0, 0, 0, 0])[2]
                            y1 = span.get('bbox', [0, 0, 0, 0])[3]

                            font = span.get('font', '')
                            size = span.get('size', 0)
                            color = span.get('color', 0)

                            item = TextItem(
                                text=text,
                                x0=x0, y0=y0, x1=x1, y1=y1,
                                font_name=font,
                                font_size=size,
                                color=color,
                                page_num=page_num,
                                block_num=block_num,
                                line_num=line_num,
                            )
                            items.append(item)

        raw_text = page.get_text("text")
        return PageData(
            page_num=page_num,
            width=width,
            height=height,
            items=items,
            raw_text=raw_text,
        )

    def close(self):
        if self.doc:
            self.doc.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()


def extract_pdf(pdf_path: str) -> List[PageData]:
    """Convenience function to extract all pages from a PDF."""
    with PDFExtractor(pdf_path) as extractor:
        return extractor.extract()
