use std::io::BufReader;
use std::io::prelude::*;
use std::net::TcpStream;

fn main() {
    let stream = TcpStream::connect("94.142.241.111:23").unwrap();
    let reader = BufReader::new(stream);

    for line in reader.lines() {
        println!("{}", line.unwrap());
    }
}

