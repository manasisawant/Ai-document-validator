import time

def validate_document(pdf_text, excel_data):

    start_time = time.time()

    comparison_results = []

    matched_count = 0
    mismatches_count = 0

    expected_data = excel_data[0]

    for field, excel_value in expected_data.items():

        excel_value = str(excel_value).strip()

        # Handle pandas datetime values
        if "00:00:00" in excel_value:
            excel_value = excel_value.split(" ")[0]

        if excel_value.lower() in pdf_text.lower():

            comparison_results.append({
                "field": field,
                "pdf_value": excel_value,
                "excel_value": excel_value,
                "status": "Matched"
            })

            matched_count += 1

        else:

            comparison_results.append({
                "field": field,
                "pdf_value": "Not Found",
                "excel_value": excel_value,
                "status": "Mismatch"
            })

            mismatches_count += 1

    total_fields = matched_count + mismatches_count

    accuracy = 0

    if total_fields > 0:
        accuracy = round((matched_count / total_fields) * 100, 2)

    processing_time = round(time.time() - start_time, 2)

    return {
        "status": "success",
        "accuracy": accuracy,
        "matched_count": matched_count,
        "mismatches_count": mismatches_count,
        "processing_time": f"{processing_time} sec",
        "comparison_results": comparison_results
    }