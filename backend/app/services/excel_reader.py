import pandas as pd


def read_excel_file(file_path):
    df = pd.read_excel(file_path)

    return df


def extract_fields_from_excel(file_path):
    df = read_excel_file(file_path)

    fields = {}

    # Handle key-value format
    if df.shape[1] >= 2:
        for _, row in df.iterrows():
            field = str(row.iloc[0]).strip()
            value = str(row.iloc[1]).strip()

            if field and field.lower() != "nan":
                fields[field] = value

    return fields