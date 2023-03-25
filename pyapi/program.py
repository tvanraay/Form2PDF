from fillpdf import fillpdfs
from csv import DictReader

# constants
string_options = {"a": 0, "b": 1, "c": 2, "1": 0, "2": 1, "3": 2}
radio_button_conversion = {"Not Necessary": "No", "Necessary": "Yes"}

# def is_numeric(x):
#     try:
#         float(x)
#         int(x)
#         return True
#     except (TypeError, ValueError):
#         return False

# def is_numbered_item(string):
#     for i, c in enumerate(string):
#         if c.isdigit():
#             validation_string = string[i : len(string)]
#             if is_numeric(validation_string):
#                 return True
#     return False

def create_formatted_data_from_csv(csv_filename: str):
    values = DictReader(open(csv_filename))
    data = {}

    for row in values:
        for key, value in row.items():
            if key not in data:
                data[key] = []
            data[key].append(value)
    return data


def fill_fields(data: "dict[str, list]", fields: "dict[str, str]") -> "dict[str, str]":
    updated = fields.copy()

    for field_key in fields:
        potential_data_key = field_key[0 : len(field_key) - 1]

        if potential_data_key in data :
            if field_key[-1] in string_options:
                reviewer_index = string_options[field_key[-1]]

                updated[field_key] = data[potential_data_key][reviewer_index]

        elif "-ave" in field_key:
            try:
                key_without_ave = field_key.replace("-ave", "")

                int_list = []

                for x in data[key_without_ave]:
                    try:
                        int_list.append(int(x))
                    except ValueError:
                        pass

                average = sum(int_list) / len(data[key_without_ave])

                updated[field_key] = str(round(average, 2))

            except ZeroDivisionError as e:
                print(e)

    return updated


# set raw data and parameters needed
data = create_formatted_data_from_csv("PeerReviewerForm2.csv")

# get all PDF fields
all_fields = fillpdfs.get_form_fields("PPP-2023-XX-X_Final_Review_Template.pdf")

field_updates = fill_fields(data, all_fields)

while 1:
    try:
        fillpdfs.write_fillable_pdf(
            "PPP-2023-XX-X_Final_Review_Template.pdf", "./bin/new1.pdf", field_updates
        )
        break

    except KeyError as e:
        message: str = e.args[0]
        split1 = message.split("(")
        final_split = []
        for message in split1:
            for sub_message in message.split(")"):
                final_split.append(sub_message)

        field_key = final_split[1]

        field_updates[field_key] = radio_button_conversion[field_updates[field_key]]
