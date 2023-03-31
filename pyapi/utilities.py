AVERAGE_CODE = "ave"
REVIEWER_ORIGINAL = "R"
AUTHOR_ORIGINAL = "AR"
REVIEWER_FOLLOW_UP = "RR"


def is_numeric(x):
    try:
        float(x)
        int(x)
        return True
    except (TypeError, ValueError):
        return False


def sanitize_list(list):
    return [x for x in list if x and x != "" and x != " "]


class TrieNode:
    """A node in the trie structure"""

    def __init__(self, char):
        # the character stored in this node
        self.char = char

        # whether this can be the end of a word
        self.is_end = False

        # a dictionary of child nodes
        # keys are characters, values are nodes
        self.children = {}


class Trie:
    """The trie object"""

    def __init__(self, keys=None):
        """
        The trie has at least the root node.
        The root node does not store any character
        """
        self.root = TrieNode("")
        if keys:
            self.form_trie(keys)

    def form_trie(self, keys):
        for key in keys:
            self.insert(key)

    def insert(self, word):
        """Insert a word into the trie"""
        node = self.root

        # Loop through each character in the word
        # Check if there is no child containing the character, create a new child for the current node
        for char in word:
            if char in node.children:
                node = node.children[char]
            else:
                # If a character is not found,
                # create a new node in the trie
                new_node = TrieNode(char)
                node.children[char] = new_node
                node = new_node

        # Mark the end of a word
        node.is_end = True

    def dfs(self, node, prefix):
        """Depth-first traversal of the trie

        Args:
            - node: the node to start with
            - prefix: the current prefix, for tracing a
                word while traversing the trie
        """
        if node.is_end:
            self.output.append((prefix + node.char))

        for child in node.children.values():
            self.dfs(child, prefix + node.char)

    def query(self, x):
        """Given an input (a prefix), retrieve all words stored in
        the trie with that prefix, sort the words by the number of
        times they have been inserted
        """
        # Use a variable within the class to keep all possible outputs
        # As there can be more than one word with such prefix
        self.output = []
        node = self.root

        # Check if the prefix is in the trie
        for char in x:
            if char in node.children:
                node = node.children[char]
            else:
                # cannot found the prefix, return empty list
                return []

        # Traverse the trie to get all candidates
        self.dfs(node, x[:-1])

        # Sort the results in reverse order and return
        return self.output
