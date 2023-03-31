import sys

from fillpdf import fillpdfs
from csv import reader
from utilities import Trie

from PdfObjects.CommentFeedbackBox import CommentFeedbackBox
from PdfObjects.MultiOptionControl import MultiOptionControl
from PdfObjects.SingleColumnBox import SingleColumnBox
from PdfObjects.PdfBoxInterface import PdfBoxInterface

if len(sys.argv) != 4:
    raise Exception("Incorrect number of arguments")

# sys argument parsing (MUST BE IN THIS ORDER)
csvFilePath, pdfFilePath, outputPath = sys.argv[1], sys.argv[2], sys.argv[3]


def create_csv_column_iter(csv_filename: str):
    fp = open(csv_filename)

    csv_reader = reader(fp)

    header = next(csv_reader)

    transposed_data = zip(*csv_reader)

    return zip(header, transposed_data)


def data_factory(iter: "zip[str, tuple[str]]"):
    data: "dict[str, PdfBoxInterface]" = {}
    prev_col = None

    for column_name, column_data in iter:
        if not column_name and len([x for x in column_data if x != ""]) <= 0:
            continue
        if (
            column_name != ""
            and not column_name.endswith("AR")
            and not column_name.endswith("RR")
        ):
            prev_col = column_name

            if column_name.endswith("-R"):
                data[column_name] = CommentFeedbackBox()
            elif column_data[0] != "":
                data[column_name] = MultiOptionControl()
            else:
                data[column_name] = SingleColumnBox()

        data[prev_col].add_data(column_data)

    return data


def fill_fields(
    data: "dict[str, PdfBoxInterface]", fields: "dict[str, str]"
) -> "dict[str, str]":
    updated = fields.copy()
    trie = Trie(fields.keys())

    for data_key in data:
        query_result = trie.query(data_key)

        for field in query_result:
            final_result = data[data_key].export_key(field)
            updated[field] = final_result if final_result else ""

    return updated


# set raw data and parameters needed
csv_reader = create_csv_column_iter(csvFilePath)

data = data_factory(csv_reader)

# get all PDF fields
all_fields = fillpdfs.get_form_fields(pdfFilePath)

field_updates = fill_fields(data, all_fields)

fillpdfs.write_fillable_pdf(pdfFilePath, outputPath, field_updates)
