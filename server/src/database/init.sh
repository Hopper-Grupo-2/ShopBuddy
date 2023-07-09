#!/bin/bash

# Start the MongoDB server without authentication
#mongod --fork --logpath /var/log/mongodb.log

# Enable authentication
# set -x
# echo $MONGO_INITDB_ROOT_USERNAME
# echo $MONGO_INITDB_ROOT_PASSWORD
# echo $MONGO_DB
# echo $MONGO_USER
# echo $MONGO_PASSWORD
# echo "use $MONGO_DB; db.createUser({ user: '$MONGO_USER', pwd: '$MONGO_PASSWORD', roles: [] })"
mongosh -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin --eval "use $MONGO_DB" --eval "db.createUser({ user: '$MONGO_USER', pwd: '$MONGO_PASSWORD', roles: ['dbOwner'] })"
# mongo
# mongo admin --eval "db.createUser({user: '$MONGO_USER', pwd: '$MONGO_PASSWORD', roles: [{role: 'root', db: 'admin'}]})"
# mongo admin -u $MONGO_USER -p $MONGO_PASSWORD --eval "db.getSiblingDB('$MONGO_DB').createUser({user: '$MONGO_USER', pwd: '$MONGO_PASSWORD', roles: [{role: 'dbOwner', db: '$MONGO_DB'}]})"
#mongod --shutdown

# Start MongoDB with authentication
#exec mongod --auth --logpath /var/log/mongodb.log

#mongosh -u root -p 123456 --authenticationDatabase admin --eval "use $MONGO_DB; db.createUser({ user: 'felipe2', pwd: 'password', roles: [] })"

