const autocannon = require('autocannon');

async function runLoadTest() {
    const result = await autocannon({
        url: 'http://localhost:3000',
        connections: 10, // 10 concurrent connections
        pipelining: 1, // 1 request in flight per connection
        duration: 10, // 10 seconds
    });

    console.log('Load Test Results:');
    console.log(`- Requests/sec: ${result.requests.average}`);
    console.log(`- Throughput/sec: ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Latency (avg): ${result.latency.average} ms`);
    console.log(`- Errors: ${result.errors}`);

    if (result.errors > 0 || result.latency.average > 500) {
        console.error('Warning: Performance issues detected!');
    }
}

runLoadTest();
