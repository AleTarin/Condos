#!/bin/bash
http post :5000/usuarios username="inquilino@gmail.com" password="admin" admin="false" inquilino:='{"nombre_condo":"Nuevo Condo", "cuarto":"1"}' propietario="false"
