from typing import Literal

from pydantic import BaseModel

from src.schemas.common import PriceConfidence


BudgetCategory = Literal[
    "Flights",
    "Hotel",
    "Food",
    "Activities",
    "Events",
    "Local transport",
    "Buffer",
]


class BudgetItem(BaseModel):
    category: BudgetCategory
    amount: float
    currency: str
    confidence: PriceConfidence
    notes: str


class BudgetSummary(BaseModel):
    currency: str
    items: list[BudgetItem]
    subtotal: float
    buffer: float
    total_estimate: float
    budget_status: Literal["under_budget", "near_budget", "over_budget", "unknown"]
