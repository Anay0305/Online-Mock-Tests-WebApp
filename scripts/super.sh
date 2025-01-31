#!/bin/bash
set -e
supervisorctl -c config/supervisord.conf $@