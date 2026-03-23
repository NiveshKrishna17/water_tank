function maxProfit(n) {
    const type = [
        { name: 'T', time: 5, rate: 1500 },
        { name: 'P', time: 4, rate: 1000 },
        { name: 'C', time: 10, rate: 2000 }
    ];

    let maxEarnings = 0;
    let result = [];

    for (let t = 0; t <= Math.floor(n / 5); t++) {
        for (let p = 0; p <= Math.floor(n / 4); p++) {
            for (let c = 0; c <= Math.floor(n / 10); c++) {

                let timeToBuildAll = (t * 5) + (p * 4) + (c * 10);

                if (timeToBuildAll <= n && timeToBuildAll > 0) {
                    let currentEarnings = 0;
                    let timeElapsed = 0;
                    const order = [
                        { count: t, ...type[0] },
                        { count: p, ...type[1] },
                        { count: c, ...type[2] }
                    ].filter(b => b.count > 0);

                    order.forEach(b => {
                        for (let i = 0; i < b.count; i++) {
                            timeElapsed += b.time;
                            currentEarnings += (n - timeElapsed) * b.rate;
                        }
                    });

                    if (currentEarnings > maxEarnings) {
                        maxEarnings = currentEarnings;
                        result = [{ T: t, P: p, C: c }];
                    } else if (currentEarnings === maxEarnings && currentEarnings > 0) {
                        result.push({ T: t, P: p, C: c });
                    }
                }
            }
        }
    }

    return { maxEarnings, result };
}

const result = maxProfit(8);
console.log(`Earnings: $${result.maxEarnings}`);

console.log("Solutins")
result.result.forEach((s, i) => {
    console.log(`${i + 1}. T: ${s.T} P: ${s.P} C: ${s.C}`);
});