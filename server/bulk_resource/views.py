from flask import abort, jsonify, redirect, render_template, request, url_for, flash, make_response
from werkzeug import secure_filename
import csv

from . import bulk_resource

@bulk_resource.route('/api/csv/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        data = request.data
        reader = csv.DictReader(data.split('\n'), delimiter=',')
        # fields = reader.next()
        # if '\xef\xbb\xbf' in fields[0]:
        #     fields[0] = fields[0].strip('\xef\xbb\xbf')
        # descriptors = [f.strip() for f in fields if f.strip() != 'Name' and f.strip() != 'Address']
        # print(fields)
        # print(descriptors)
        csv_parsed = []
        for row in reader:
            csv_parsed.append(row)
        return csv_parsed
