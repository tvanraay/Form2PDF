from utilities import is_numeric, sanitize_list, AVERAGE_CODE
from PdfObjects.PdfBoxInterface import PdfBoxInterface


class SingleColumnBox(PdfBoxInterface):
    def __init__(self) -> None:
        self.data = []

    def add_data(self, static_column: tuple) -> None:
        if not static_column or len(static_column) == 0:
            raise Exception("SingleColumnBox: Data is empty")

        column = list(static_column)

        if column[0] == "":
            temp = column[1 : len(column)]
            column = temp.copy()

        self.data = column.copy()

    def export_key(self, field: str) -> str:
        if not field:
            raise Exception("SingleColumnBox: export data is undefined")

        if AVERAGE_CODE in field:
            return self.integer_avrg()

        letter = field[-1]
        index = ord(letter) - 97

        if index < len(self.data):
            return self.data[index]

        return self.data[0]

    def integer_avrg(self) -> str:
        num_list = []
        sanitized_data = sanitize_list(self.data)

        for val in sanitized_data:
            if not is_numeric(val):
                raise Exception("SingleColumnBox: Non numeric data found")
            num_list.append(int(val))

        average = 0
        if len(self.data) > 0:
            average = sum(num_list) / len(self.data)

        return str(round(average, 2))
