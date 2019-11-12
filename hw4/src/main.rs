use rand::Rng;
use redis::{Client, Commands};
use rusqlite::{params, Connection, Result};
use serde::{Serialize, Deserialize};
use serde_json::json;

#[derive(Serialize, Deserialize, Debug)]
struct Person {
    id: u32,
    networth: f64
}

struct Backend {
    sqldb: Connection,
    redisdb: Client
}

fn get_person(backend: &Backend, id: u32) {
    let mut redis_conn = backend.redisdb.get_connection().unwrap();
    let key = format!("user:{}", id);
    let value: redis::RedisResult<String> = redis_conn.get(&key);

    if value != None {
        println!("{:?}", value);
        return;
    }

    let mut stmt = backend.sqldb.prepare("SELECT * FROM person WHERE id=?").unwrap();
    let person_iter = stmt.query_map(params![id], |row| {
        Ok(Person {
            id: row.get(0).unwrap(),
            networth: row.get(1).unwrap()
        })
    }).unwrap();

    for person in person_iter {
        let p = person.unwrap();
        println!("Found person {:?} from SQL database. Caching in Redis.", p);
        let _ : redis::RedisResult<String> = redis_conn.set(&key, json!(p).as_str());
    }
}

fn main() -> Result<()> {
    let backend = Backend {
        sqldb: Connection::open_in_memory()?,
        redisdb: redis::Client::open("redis://127.0.0.1/").unwrap()
    };

    backend.sqldb.execute_batch(
        "
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
        "
    )?;
    let mut redis_conn = backend.redisdb.get_connection().unwrap();
    let _ : redis::RedisResult<String> = redis_conn.set("data", "{}");

    let mut rng = rand::thread_rng();
    for _ in 0..10 {
        let rand = rng.gen::<u32>() % 5;
        get_person(&backend, rand);
    }
    Ok(())
}
