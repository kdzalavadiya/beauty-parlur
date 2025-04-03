#!/usr/bin/env python3
"""
Simple HTTP Server for local development with support for common file types.
Run this script and navigate to http://localhost:8000 in your browser.
"""

import http.server
import socketserver
import os
from urllib.parse import urlparse

# Configuration
PORT = 8000

# Custom request handler
class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler with improved logging and content types."""
    
    # Add additional MIME types
    extensions_map = {
        '': 'application/octet-stream',
        '.html': 'text/html',
        '.htm': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.webp': 'image/webp',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.otf': 'font/otf',
        '.eot': 'application/vnd.ms-fontobject',
        '.map': 'application/json',
    }
    
    def log_message(self, format, *args):
        """Enhanced logging with full URL path."""
        path = urlparse(self.path).path
        print(f"[{self.log_date_time_string()}] {self.address_string()} - {path} - {format % args}")
    
    def end_headers(self):
        """Add CORS headers to allow testing with different ports."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run_server():
    """Start the HTTP server."""
    try:
        handler = CustomHTTPRequestHandler
        
        # Try to reuse the address/port if it's in TIME_WAIT state
        socketserver.TCPServer.allow_reuse_address = True
        
        # Create and start the server
        with socketserver.TCPServer(("", PORT), handler) as httpd:
            print(f"Server started at http://localhost:{PORT}")
            print("Press Ctrl+C to stop the server")
            print(f"Serving files from: {os.getcwd()}")
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except OSError as e:
        if e.errno == 10048:  # Windows-specific error for address already in use
            print(f"ERROR: Port {PORT} is already in use.")
            print("Try a different port or close the application using this port.")
        else:
            print(f"ERROR: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    run_server() 