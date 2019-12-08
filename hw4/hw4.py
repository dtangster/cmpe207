import random

from flask import Flask
import redis
import sqlite3


CREATE_TABLE_QUERY = '''
    BEGIN;
    CREATE TABLE person (
        id INTEGER PRIMARY KEY,
        networth REAL
    );
    INSERT INTO person (networth) VALUES (100.00);
    INSERT INTO person (networth) VALUES (250.99);
    INSERT INTO person (networth) VALUES (469.40);
    INSERT INTO person (networth) VALUES (30569.47);
    INSERT INTO person (networth) VALUES (5535.12);
    COMMIT;
'''

app = Flask(__name__)
r = redis.Redis(host='localhost', port=6379, db=0)
s = sqlite3.connect(":memory:")
s.executescript(CREATE_TABLE_QUERY)

@app.route('/<int:user_id>')
def get_person(user_id):
    networth = r.get(user_id)
    if networth:
        networth = float(networth.decode('utf8'))
        return f'Found user {user_id} in redis cache. Networth: ${networth}\n'
    else:
        person = s.execute(f'select * from person where id={user_id}').fetchone()
        r.set(user_id, person[1])
        return f'User {user_id} is not in redis cache. Fetching from sqlite and caching into redis. Networth: ${person[1]}\n'


