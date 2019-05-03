'''server/app.py - main api app declaration'''
import os
from flask import Flask, jsonify, send_from_directory
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
from flask_assets import Environment
from flask_wtf import CsrfProtect
from flask_compress import Compress
from flask_rq import RQ

basedir = os.path.abspath(os.path.dirname(__file__))

mail = Mail()
db = SQLAlchemy()
csrf = CsrfProtect()
compress = Compress()
# Set up Flask-Login
login_manager = LoginManager()
# TODO: Ideally this should be strong, but that led to bugs. Once this is
# fixed, switch protection mode back to 'strong'
login_manager.session_protection = 'basic'
login_manager.login_view = 'account.login'


# CREATE APP
app = Flask(__name__, static_folder='../build')
CORS(app)

#
# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def index(path):
#   '''Return index.html for all non-api routes'''
#   #pylint: disable=unused-argument
#   return send_from_directory(app.static_folder, 'index.html')

# # Set up extensions
# mail.init_app(app)
# db.init_app(app)
# login_manager.init_app(app)
# csrf.init_app(app)
# compress.init_app(app)
# RQ(app)

# # Configure SSL if platform supports it
# if not app.debug and not app.testing and not app.config['SSL_DISABLE']:
#     from flask.ext.sslify import SSLify
#     SSLify(app)

# Create app blueprints
from main import main as main_blueprint
app.register_blueprint(main_blueprint)
