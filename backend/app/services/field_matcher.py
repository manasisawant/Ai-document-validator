import re


FIELD_SYNONYMS = {
    "number": ["no", "num", "number"],
    "name": ["name"],
    "amount": ["amount", "price", "value", "total amount"],
    "total": ["total", "grand total"],
    "marks": ["marks", "score", "points"],
    "roll number": ["roll no", "roll number", "roll"],
    "invoice number": ["invoice no", "invoice number", "invoice"],
}


def normalize_field_name(field_name):
    field_name = str(field_name).lower().strip()

    field_name = re.sub(r"[_\-]+", " ", field_name)
    field_name = re.sub(r"\s+", " ", field_name)

    return field_name


def find_matching_field(field_name, available_fields):
    normalized_field = normalize_field_name(field_name)

    # Exact normalized match
    for available_field in available_fields:
        if normalized_field == normalize_field_name(available_field):
            return available_field

    # Synonym match
    for key, synonyms in FIELD_SYNONYMS.items():
        if normalized_field == key or normalized_field in synonyms:

            for available_field in available_fields:
                normalized_available = normalize_field_name(available_field)

                if (
                    normalized_available == key
                    or normalized_available in synonyms
                ):
                    return available_field

    return None