const connections = [];

self.onconnect = function(e) {
  const port = e.ports[0];
  connections.push(port);
  
  port.onmessage = function(e) {
    const message = e.data;
    
    connections.forEach(conn => {
      if (conn !== port) {
        conn.postMessage(`Tab ${connections.indexOf(port) + 1}: ${message}`);
      }
    });
    
    port.postMessage(`Message sent: ${message}`);
  };
  
  port.start();
};
