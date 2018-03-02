#!/bin/bash
http --session=user -f post :5000/validar_login username=$1 password=$2
