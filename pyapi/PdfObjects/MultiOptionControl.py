from PdfObjects.PdfBoxInterface import PdfBoxInterface
import sys


class MultiOptionControl(PdfBoxInterface):
    def __init__(self) -> None:
        self.data = {}

    def add_data(self, static_column: tuple) -> None:
        if not static_column or len(static_column) == 0 or static_column[0] == "":
            raise Exception("MultiOptionControl: Data is invalid", static_column)

        sub_header = static_column[0]
        col_data = list(static_column[1 : len(static_column)])
        self.data[sub_header] = col_data.copy()

    def export_key(self, field: str) -> str:
        if not field:
            raise Exception("MultiOptionControl: export data is undefined")

        # normal dropdown
        letter = field[-1]
        if ord(letter) >= 97 and ord(letter) <= 122:
            index = ord(letter) - 97
            for key in self.data:
                if self.data[key][index]:
                    return key

        # check box groups      
        else:
            letter = field[-2]
            reviewer_index = ord(letter) - 97
            key_index = int(field[-1]) - 1

            for i, key in enumerate(self.data):
                if i == key_index:
                    if self.data[key][reviewer_index]:
                        return "Yes"
                    else:
                        return "No"
                
        raise Exception("MultiOptionControl: Something went horribly wrong")
