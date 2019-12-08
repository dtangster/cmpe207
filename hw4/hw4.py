import random

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

r = redis.Redis(host='localhost', port=6379, db=0)
s = sqlite3.connect(":memory:")


def get_person(user_id):
    networth = r.get(user_id)
    if networth:
        networth = float(networth.decode('utf8'))
        print(f'Found {user_id} in redis cache. Networth: ${networth}')
    else:
        person = s.execute(f'select * from person where id={user_id}').fetchone()
        print(f'User {user_id} is not in redis cache. Fetching from sqlite and caching into redis. Networth: ${person[1]}')
        r.set(user_id, person[1])


def main():
    # Create a table with several entries
    s.executescript(CREATE_TABLE_QUERY)

    for i in range(20):
        user_id = (random.randint(0, 500) % 5) + 1
        get_person(user_id)


if __name__ == '__main__':
    main()
