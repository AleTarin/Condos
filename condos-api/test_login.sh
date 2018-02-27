#!/bin/bash
http -f post :5000/login username=$1 password=$2
