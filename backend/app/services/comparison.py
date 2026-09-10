from app.services.field_matcher import find_matching_field


def compare_fields(document_fields, excel_fields):
    results = []

    matched_count = 0
    mismatches_count = 0

    used_excel_fields = set()

    for document_field, document_value in document_fields.items():

        excel_field = find_matching_field(
            document_field,
            excel_fields.keys()
        )

        if excel_field is None:
            results.append({
                "field": document_field,
                "document_value": document_value,
                "excel_value": None,
                "status": "Missing in Excel"
            })
            continue

        used_excel_fields.add(excel_field)

        excel_value = excel_fields[excel_field]

        if (
            str(document_value).strip().lower()
            == str(excel_value).strip().lower()
        ):
            status = "Matched"
            matched_count += 1
        else:
            status = "Mismatch"
            mismatches_count += 1

        results.append({
            "field": document_field,
            "document_value": document_value,
            "excel_value": excel_value,
            "status": status
        })

    # Find fields that exist only in Excel
    for excel_field, excel_value in excel_fields.items():

        if excel_field not in used_excel_fields:
            results.append({
                "field": excel_field,
                "document_value": None,
                "excel_value": excel_value,
                "status": "Missing in document"
            })

    total_fields = len(results)

    if total_fields > 0:
        accuracy = (matched_count / total_fields) * 100
    else:
        accuracy = 0

    return {
        "accuracy": round(accuracy, 2),
        "matched_count": matched_count,
        "mismatches_count": mismatches_count,
        "total_fields": total_fields,
        "results": results
    }