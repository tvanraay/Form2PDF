from PdfObjects.PdfBoxInterface import PdfBoxInterface


class CommentFeedbackBox(PdfBoxInterface):
    def __init__(self):
        self.comments = []

    def add_data(self, static_column: tuple) -> None:
        if not static_column or len(static_column) == 0:
            raise Exception("CommentFeedbackBox: Data is empty")

        for i, comment in enumerate(static_column):
            if i >= len(self.comments):
                self.comments.append([])
            self.comments[i].append(comment)

    def export_key(self, field: str) -> str:
        if not field:
            raise Exception("CommentFeedbackBox: export data is undefined")

        reviewer_num = int(field[-1])

        # TODO: label R, AR, and RR on pdf
        final_string = "\n\n".join(self.comments[reviewer_num])

        return final_string
