# Gate.io & MAX XEMM

<p class="date-location">September 3, 2024 @ UIUC</p>
<hr>

This strategy implements XEMM strategy across Gate.io and MAX, with Gate.io as taker market and MAX as maker market.

## Introduction

Gate.io is a prominent exchange with substantial daily transaction volumes, offering excellent liquidity for cryptocurrency trading. In contrast, MAX has lower liquidity and a smaller user base. This disparity creates a prime opportunity for implementing an XEMM strategy between the two exchanges.

Our strategy involves placing a limit order on MAX, with the order type determined by the current balance of the MAX account. If there is a surplus of USDT, we initiate buy orders; otherwise, we place sell orders. Once a limit order is executed, we then place a corresponding market order on Gate.io to hedge the position.

By buying at a lower price and selling at a higher price, we can capture a profit equal to the price difference, minus trading fees. The total trading fee is 0.052% (comprising a 0.06% taker fee on Gate.io and a -0.008% maker fee on MAX).

## Implementation

I implemented the strategy using TypeScript, which is known for its superior performance compared to Python.

You can find the open-source source code on my <a href="https://github.com/cjchang925/max-hacker" target="_blank">GitHub</a> page.

### Step 1: Connect to Gate.io and MAX websocket server

Refer to <a href="https://www.gate.io/docs/developers/apiv4/" target="_blank">Gate.io API Document</a> and <a href="https://max.maicoin.com/documents/api" target="_blank">MAX API Document</a> for details.

- Gate.io WebSocket API & Stream: Monitor current price and place market orders instantly.
- MAX WebSocket Stream: Monitor trades of my account.

### Step 2: Determine the direction of XEMM
- If my base asset balance in MAX exceeds that of USDT, sell the asset on MAX and buy on Gate.io.
- If not, buy the asset on MAX and sell on Gate.io.

### Step 3: Place a limit order on MAX

Place a limit order at a profitable price, which is 0.1% higher than the current price on Gate. The number 0.1% is calculated by the trading fees 0.052% plus a fault tolerance of 0.048%. Sometimes the price on Gate.io varies very fast and we cannot always trade on the ideal price. The fault tolerance reduces the damage of price slippage and ensures our trades are profitable.

### Step 4: Cancel unprofitable orders

When the price on Gate.io changes, the active orders on MAX might be unprofitable. That is, the price difference between Gate.io and MAX’s order becomes less than the trading fee 0.052%. To avoid losing money, we should cancel those orders.

### Step 5: Hedge on Gate.io whenever an order is filled on MAX

When we receive a message reporting that an order is filled on MAX, we should hedge on Gate.io with the same volume immediately. Ideally, the amount of our base asset should remain the same, but we are going to have more USDT.

<br><br><br>
