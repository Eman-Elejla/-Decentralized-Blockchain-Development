# Decentralized Blockchain Network

A simple decentralized blockchain implementation built using **Node.js**, **Express.js**, and **Axios**.

This project demonstrates the fundamental concepts of decentralized blockchain networks, including block mining, SHA-256 hashing, Proof of Work (PoW), node registration, peer-to-peer communication, and conflict resolution using the Longest Chain Rule.

##  Features

- **Block Creation:** Create new blocks containing custom data.
- **SHA-256 Hashing:** Generate cryptographic hashes for blocks.
- **Proof of Work (PoW):** Mine blocks by finding a hash that meets the required difficulty.
- **Decentralized Nodes:** Run multiple blockchain nodes independently.
- **Node Registration:** Register other nodes in the network.
- **Peer-to-Peer Communication:** Exchange blockchain data between registered nodes using HTTP requests.
- **Conflict Resolution:** Compare blockchain copies and replace the local chain with a longer valid chain.
- **Blockchain Explorer:** Retrieve all blocks stored in a node.
- **Chain Validation:** Verify the hash links between consecutive blocks.

##  Technologies Used

- **Node.js** – JavaScript runtime environment.
- **Express.js** – Framework for building REST APIs.
- **Axios** – HTTP client for communication between blockchain nodes.
- **Crypto** – Node.js built-in module for SHA-256 hashing.

##  Project Structure

```text
decentralized-blockchain/
│
├── server.js
└── README.md
```

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Eman-Elejla/decentralized-blockchain.git
```

### 2. Navigate to the Project Directory

```bash
cd decentralized-blockchain
```

### 3. Install Dependencies

```bash
npm install express axios
```

### 4. Start Blockchain Nodes

Each node runs independently on a different port.

**Terminal 1 – Node 1**

```bash
node server.js 3000
```

**Terminal 2 – Node 2**

```bash
node server.js 3001
```

**Terminal 3 – Node 3**

```bash
node server.js 3002
```

Each node will have its own blockchain instance.

The nodes will be accessible at:

| Node | URL |
|---|---|
| Node 1 | http://localhost:3000 |
| Node 2 | http://localhost:3001 |
| Node 3 | http://localhost:3002 |

## 🔗 API Endpoints

### 1. Explore the Blockchain

**Endpoint:**

```http
GET /explorer
```

Returns the complete blockchain stored on the current node.

**Example:**

```bash
curl http://localhost:3000/explorer
```

### 2. Mine a New Block

**Endpoint:**

```http
POST /mine
```

Creates and mines a new block containing the submitted data.

**Request Body:**

```json
{
  "data": {
    "message": "Hello Blockchain!",
    "amount": 100
  }
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/mine \
-H "Content-Type: application/json" \
-d '{"data":{"message":"Hello Blockchain!","amount":100}}'
```

### 3. Register Nodes

**Endpoint:**

```http
POST /nodes/register
```

Registers other blockchain nodes in the current node's network.

**Request Body:**

```json
{
  "nodes": [
    "http://localhost:3001",
    "http://localhost:3002"
  ]
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/nodes/register \
-H "Content-Type: application/json" \
-d '{"nodes":["http://localhost:3001","http://localhost:3002"]}'
```

### 4. Resolve Blockchain Conflicts

**Endpoint:**

```http
GET /nodes/resolve
```

Communicates with registered nodes, retrieves their blockchains, validates their hash links, and replaces the local blockchain if a longer valid chain is found.

**Example:**

```bash
curl http://localhost:3000/nodes/resolve
```

**Possible Responses:**

```json
{
  "message": "Chain was replaced",
  "chain": []
}
```

Or:

```json
{
  "message": "Our chain is the longest (Authoritative)",
  "chain": []
}
```

## How It Works

### 1. Blockchain Structure

Each block contains:

| Property | Description |
|---|---|
| `index` | Position of the block in the chain. |
| `timestamp` | Block creation date and time. |
| `data` | Information stored inside the block. |
| `previousHash` | Hash of the previous block. |
| `nonce` | Number used during mining. |
| `hash` | SHA-256 hash of the current block. |

### 2. Proof of Work

The mining process repeatedly increments the nonce until the generated hash starts with a specific number of leading zeros.

Current difficulty:

```javascript
this.difficulty = 2;
```

A valid block hash must start with `00`.

### 3. Decentralized Network

Each node maintains its own copy of the blockchain and can communicate with other registered nodes.

Nodes do not share a single central blockchain instance.

### 4. Conflict Resolution

When multiple nodes have different blockchain versions, the `resolveConflicts()` method:

1. Requests the blockchain from each registered node.
2. Compares the length of each received chain with the local chain.
3. Validates the hash links between consecutive blocks.
4. Replaces the local chain if a longer valid chain is found.

This implementation demonstrates a simplified version of the **Longest Chain Rule**.

##  Example: Running a Decentralized Network

To test communication between nodes:

**Step 1:** Start three nodes on different ports.

**Step 2:** Register Node 2 and Node 3 with Node 1.

```bash
curl -X POST http://localhost:3000/nodes/register \
-H "Content-Type: application/json" \
-d '{"nodes":["http://localhost:3001","http://localhost:3002"]}'
```

**Step 3:** Mine blocks on different nodes.

```bash
curl -X POST http://localhost:3001/mine \
-H "Content-Type: application/json" \
-d '{"data":"Transaction from Node 2"}'
```

**Step 4:** Resolve conflicts on Node 1.

```bash
curl http://localhost:3000/nodes/resolve
```

**Step 5:** Explore the updated blockchain.

```bash
curl http://localhost:3000/explorer
```

##  Limitations

This project is an educational implementation and is not production-ready.

- Blockchain data is stored in memory and is lost when a node restarts.
- Chain validation only checks the links between consecutive blocks.
- Proof of Work is not fully revalidated during conflict resolution.
- The network does not implement digital signatures or transaction verification.
- There is no authentication or encryption between nodes.
- Node registration does not automatically synchronize all network participants.
- The longest-chain rule is implemented in a simplified form and does not account for cumulative Proof of Work.

##  Learning Objectives

This project was developed to explore:

- Object-Oriented Programming (OOP).
- Cryptographic hashing using SHA-256.
- Proof of Work consensus mechanism.
- Blockchain data structures.
- Decentralized network architecture.
- HTTP communication between nodes.
- Node registration and network management.
- Blockchain validation and conflict resolution.
- REST API development using Express.js.

## 📄 License

This project is available for educational and learning purposes.
