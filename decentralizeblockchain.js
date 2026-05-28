const express = require('express');
const crypto = require('crypto');
const axios = require('axios'); 
const app = express();
app.use(express.json());

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce)
            .digest('hex');
    }

    mine(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

class DecentralizedBlockchain {
    constructor() {
        this.chain = [new Block(0, new Date().toISOString(), "Genesis Block", "0")];
        this.difficulty = 2;
        this.nodes = new Set(); 
    }

    registerNode(address) {
        this.nodes.add(address);
    }

    async resolveConflicts() {
        let newChain = null;
        let maxLength = this.chain.length;

        for (let node of this.nodes) {
            try {
                const response = await axios.get(`${node}/explorer`);
                const length = response.data.length;
                const chain = response.data;

                if (length > maxLength && this.isValidChain(chain)) {
                    maxLength = length;
                    newChain = chain;
                }
            } catch (err) {
                console.log(`Node ${node} unreachable`);
            }
        }

        if (newChain) {
            this.chain = newChain;
            return true;
        }
        return false;
    }

    isValidChain(chain) {
        for (let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const previousBlock = chain[i - 1];
            if (currentBlock.previousHash !== previousBlock.hash) return false;
        }
        return true;
    }

    setBlock(data) {
        const lastBlock = this.chain[this.chain.length - 1];
        const newBlock = new Block(this.chain.length, new Date().toISOString(), data, lastBlock.hash);
        newBlock.mine(this.difficulty);
        this.chain.push(newBlock);
        return newBlock;
    }
}

const myBlockchain = new DecentralizedBlockchain();


app.get('/explorer', (req, res) => {
    res.json(myBlockchain.chain);
});

app.post('/mine', (req, res) => {
    const block = myBlockchain.setBlock(req.body.data);
    res.send({ message: "Block Mined!", block });
});

app.post('/nodes/register', (req, res) => {
    const { nodes } = req.body;
    if (!nodes) return res.status(400).send("No nodes provided");
    nodes.forEach(node => myBlockchain.registerNode(node));
    res.send({ message: "Nodes added", total: myBlockchain.nodes.size });
});

app.get('/nodes/resolve', async (req, res) => {
    const replaced = await myBlockchain.resolveConflicts();
    const message = replaced ? "Chain was replaced" : "Our chain is the longest (Authoritative)";
    res.send({ message, chain: myBlockchain.chain });
});

const PORT = process.argv[2] || 3000;
app.listen(PORT, () => console.log(`Blockchain Node running on port ${PORT}`));