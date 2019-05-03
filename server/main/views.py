from flask import render_template, url_for, request, jsonify, make_response
from . import main

@main.route('/api/test')
def index():
  '''Sample API route for data'''
  print('here')
  return jsonify([{'title': 'A'}, {'title': 'C'}])
