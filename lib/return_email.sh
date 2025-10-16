#!/bin/sh
printf "bartoszwiaderek@gmail.com"

# samba-tool user show bwiaderek -U TRAUGUTT/bwiaderek -H ldap://10.10.1.2 --password=$PASS | grep mail | awk '{print $2}'