use std::{thread, time};
use std::io::{Write, Error};
use std::net::{TcpListener, TcpStream};


fn handle_client(mut stream: TcpStream) -> Result<(), Error> {
    let interval = time::Duration::from_millis(1000);
    let kirby = ["(>'-')>", "<('-'<)", "^('-')^", "v('-')v", " (^-^) "];
    let clear = "\x1b[2J\x1b[1;1H";
    let mut iter = 0;

    loop {
        let index = iter % kirby.len();
        let output = clear.to_owned() + kirby[index] + "\n";
        stream.write(output.as_bytes())?;
        thread::sleep(interval);
        iter += 1;
    }
}

fn main() {
    let address = "0.0.0.0:9099";
    let listener = TcpListener::bind(address).expect("Could not bind");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                thread::spawn(move || {
                    handle_client(stream).unwrap_or_else(|error| eprintln!("{:?}", error))
                });
            }
            Err(error) => {
                eprintln!("Incoming client failed: {}", error)
            }
        }
    }
}
