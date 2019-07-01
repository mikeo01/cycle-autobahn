#!/bin/bash

docker stop crossbar
docker run -it --rm --name=crossbar -p 8500:8500 -v //$PWD:/node crossbario/crossbar
