(async () => {
  const url = 'http://localhost:3000/api/products';
  const maxAttempts = 12;
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      console.log(JSON.stringify(data, null, 2));
      process.exit(0);
    } catch (err) {
      console.error(`Attempt ${i} failed: ${err.message}`);
      if (i === maxAttempts) process.exit(1);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
})();
