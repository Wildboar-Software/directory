#!/bin/sh

mkdir -p ca/ca.db.certs
# mkdir dsa1
# mkdir dsa2
touch ca/ca.db.index
echo "1234" > ca/ca.db.serial
openssl req -x509 -newkey rsa:2048 -sha256 -days 3650 -nodes -keyout god.key -out god.crt -subj "/CN=god"
openssl req -new -newkey rsa:1024 -nodes -keyout dsa1.key.pem -out req1.pem -subj "/CN=dsa1"
openssl req -new -newkey rsa:1024 -nodes -keyout dsa2.key.pem -out req2.pem -subj "/CN=dsa2"
openssl req -new -newkey rsa:1024 -nodes -keyout dsa3.key.pem -out req3.pem -subj "/CN=dsa3"

# I don't know why using sha256 in the config won't work. You have to specify it
# in these lines for some godforsaken reason.
# If you don't use sha256 or stronger, you'll get "md too weak".
openssl ca -batch -config openssl.cnf -md sha256 -out dsa1.crt -infiles req1.pem
openssl ca -batch -config openssl.cnf -md sha256 -out dsa2.crt -infiles req2.pem
openssl ca -batch -config openssl.cnf -md sha256 -out dsa3.crt -infiles req3.pem
# TODO: Use openssl x509 -in /root/ca/certs/domain.tld.crt to extract just the encoded cert part.
# There is a manual step here where I remove the text (non-PEM-encoded) part.

openssl x509 -in ./dsa1.crt > dsa1.chain.crt
openssl x509 -in ./dsa2.crt > dsa2.chain.crt
openssl x509 -in ./dsa3.crt > dsa3.chain.crt
cat god.crt >> dsa1.chain.crt
cat god.crt >> dsa2.chain.crt
cat god.crt >> dsa3.chain.crt

# This is for testing Rule-Based Access Control with a set of attribute certificates I created separately.
openssl req -new -newkey rsa:1024 -nodes -keyout jt.key.pem -out reqjt.pem -subj "/C=CA/CN=Justin Trudeau"
openssl ca -batch -config openssl.cnf -md sha256 -out jt.crt -infiles reqjt.pem
openssl x509 -in ./jt.crt > jt.chain.crt
cat god.crt >> jt.chain.crt
