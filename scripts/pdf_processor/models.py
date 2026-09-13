"""
models.py — Document model schema for TrifectaStudy PDF processing.
"""
import uuid
from dataclasses import dataclass, field, asdict
from typing import List, Optional


@dataclass
class Block:
    type: str  # paragraph | heading | math | table | list | image | raw | page_break
    id: str
    page: int
    text: Optional[str] = None
    latex: Optional[str] = None
    display: bool = False
    confidence: float = 1.0
    level: Optional[int] = None
    items: Optional[List[str]] = None
    ordered: bool = False
    columns: Optional[List[str]] = None
    rows: Optional[List[List[str]]] = None
    alignments: Optional[List[str]] = None
    mergedCells: Optional[List[dict]] = None
    src: Optional[str] = None
    alt: Optional[str] = None
    reason: Optional[str] = None
    bbox: Optional[List[float]] = None

    def to_dict(self):
        return {k: v for k, v in asdict(self).items() if v is not None}


@dataclass
class Section:
    id: str
    title: str
    level: int
    pages: List[int]
    blocks: List[Block] = field(default_factory=list)
    confidence: float = 1.0

    def to_dict(self):
        d = asdict(self)
        d['blocks'] = [b.to_dict() if isinstance(b, Block) else b for b in d['blocks']]
        return d


@dataclass
class Metadata:
    title: str
    source_file: str
    category: str
    subject: str
    page_count: int
    is_scanned: bool = False
    warnings: List[str] = field(default_factory=list)
    extracted_at: str = ""

    def to_dict(self):
        return asdict(self)


@dataclass
class MaterialDocument:
    schema_version: str = "1.0"
    parser_version: str = "0.1.0"
    metadata: Optional[Metadata] = None
    sections: List[Section] = field(default_factory=list)

    def to_dict(self):
        d = asdict(self)
        if self.metadata:
            d['metadata'] = self.metadata.to_dict()
        d['sections'] = [s.to_dict() if isinstance(s, Section) else s for s in d['sections']]
        return d


def make_block_id() -> str:
    return f"block-{uuid.uuid4().hex[:8]}"


def make_section_id(title: str) -> str:
    import re
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    return slug or "section"
