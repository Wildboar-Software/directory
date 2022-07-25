#/bin/sh

openssl req -x509 -newkey rsa:4096 -keyout data/keypair/key.pem -out data/keypair/cert.pem -sha256 -days 730 -nodes
