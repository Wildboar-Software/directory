#!/bin/sh

mkdir -p ca/ca.db.certs
# mkdir dsa1
# mkdir dsa2
touch ca/ca.db.index
echo "1234" > ca/ca.db.serial
openssl req -x509 -newkey rsa:2048 -sha256 -days 3650 -nodes -keyout god.key -out god.crt -subj "/CN=god"
openssl req -new -newkey rsa:1024 -nodes -keyout dsa1.key.pem -out req1.pem -subj "/CN=dsa1"
openssl req -new -newkey rsa:1024 -nodes -keyout dsa2.key.pem -out req2.pem -subj "/CN=dsa2"

# I don't know why using sha256 in the config won't work. You have to specify it
# in these lines for some godforsaken reason.
# If you don't use sha256 or stronger, you'll get "md too weak".
openssl ca -batch -config openssl.cnf -md sha256 -out dsa1.crt -infiles req1.pem
openssl ca -batch -config openssl.cnf -md sha256 -out dsa2.crt -infiles req2.pem
# TODO: Use openssl x509 -in /root/ca/certs/domain.tld.crt to extract just the encoded cert part.
# There is a manual step here where I remove the text (non-PEM-encoded) part.
cat dsa1.crt god.crt > dsa1.chain.crt
cat dsa2.crt god.crt > dsa2.chain.crt
