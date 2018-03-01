#!/bin/bash
http --session=user -f post :5000/cambiar_password username=$1 password_actual=$2 password_nueva=$3
