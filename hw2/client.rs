use std::io::BufReader;
use std::io::prelude::*;
use std::net::TcpStream;

fn main() {
    let stream = TcpStream::connect("127.0.0.1:9099").unwrap();
    let reader = BufReader::new(stream);

    for line in reader.lines() {
        println!("{}", line.unwrap());
    }
}

