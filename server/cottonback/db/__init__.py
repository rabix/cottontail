import six
import datetime

from flask_mongokit import Document

class User(Document):
    __collection__ = 'users'
    structure = {
        'username': six.text_type,
        'text': six.text_type,
        'creation': datetime,
    }
    required_fields = ['title', 'creation']
    default_values = {'creation': datetime.utcnow}
    use_dot_notation = True
