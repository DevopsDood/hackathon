//! VPN Daemon - Main Entry Point
//!
//! Post-quantum VPN daemon with Kyber-768 + X25519 hybrid encryption

use tracing::{info, error, Level};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize logging
    tracing_subscriber::fmt()
        .with_max_level(Level::INFO)
        .init();

    info!("VPN Daemon v{}", env!("CARGO_PKG_VERSION"));
    info!("Post-Quantum VPN with Kyber-768 + X25519 hybrid encryption");
    
    // Parse command line arguments
    let args: Vec<String> = std::env::args().collect();
    
    if args.len() < 2 {
        print_usage();
        return Ok(());
    }

    match args[1].as_str() {
        "start" => {
            info!("Starting VPN daemon...");
            // TODO: Start daemon
        }
        "keygen" => {
            info!("Generating new key pair...");
            test_keygen().await?;
        }
        "test" => {
            info!("Running tests...");
            run_tests().await?;
        }
        "status" => {
            print_status();
        }
        _ => {
            print_usage();
        }
    }

    Ok(())
}

fn print_usage() {
    println!("Usage: vpn-daemon <command>");
    println!("Commands:");
    println!("  start   - Start the VPN daemon");
    println!("  keygen  - Generate new key pair");
    println!("  test    - Run tests");
    println!("  status  - Show status");
}

fn print_status() {
    println!("VPN Daemon Status");
    println!("Version: {}", env!("CARGO_PKG_VERSION"));
    println!("Post-Quantum: Enabled (Kyber-768 + X25519)");
    println!("Key Rotation: Automatic (2 hour interval)");
    println!("Status: Ready");
}

async fn test_keygen() -> Result<(), Box<dyn std::error::Error>> {
    use vpn_daemon::kyber::Kyber768;
    use rand::rngs::OsRng;
    
    let kyber = Kyber768::new();
    let (sk, pk) = kyber.keygen(&mut OsRng)?;
    
    info!("Generated Kyber-768 key pair:");
    info!("  Secret key: {} bytes", sk.data.len());
    info!("  Public key: {} bytes", pk.data.len());
    
    // Test encapsulation
    let (ct, ss1) = kyber.encapsulate(&pk)?;
    let ss2 = kyber.decapsulate(&sk, &ct)?;
    
    assert_eq!(ss1, ss2);
    info!("Encapsulation test: PASSED");
    
    Ok(())
}

async fn run_tests() -> Result<(), Box<dyn std::error::Error>> {
    info!("Running basic tests...");
    
    use vpn_daemon::kyber::Kyber768;
    use vpn_daemon::PostQuantumHandshake;
    use vpn_daemon::PeerInfo;
    use rand::rngs::OsRng;
    
    // Test Kyber
    let kyber = Kyber768::new();
    let (sk, pk) = kyber.keygen(&mut OsRng)?;
    let (ct, ss1) = kyber.encapsulate(&pk)?;
    let ss2 = kyber.decapsulate(&sk, &ct)?;
    assert_eq!(ss1, ss2);
    info!("✓ Kyber-768 encapsulation/decapsulation");
    
    // Test handshake
    let handshake = PostQuantumHandshake::new();
    let peer = PeerInfo {
        id: "test-peer".to_string(),
        static_public_key: None,
        kyber_public_key: None,
    };
    let result = handshake.perform_initiator_handshake(&peer).await?;
    info!("✓ Post-quantum handshake: session_id={}", result.session_id);
    
    info!("All tests passed!");
    Ok(())
}