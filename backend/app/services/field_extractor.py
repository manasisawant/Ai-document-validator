import re


def extract_fields_from_text(text):
    fields = {}

    lines = text.splitlines()

    for line in lines:
        line = line.strip()

        if ":" not in line:
            continue

        field, value = line.split(":", 1)

        field = field.strip()
        value = value.strip()

        if field and value:
            fields[field] = value

    return fields