const fs = require('fs/promises');
const http = require('http');

const hostname = 'localhost';
const port = 3000;


const server = http.createServer(async (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    const data = await main();
    res.write(`<pre >${JSON.stringify(data, null, 2)}</pre>`); 
});

// complete the code here
const readJsonFile = async () => {
    const data = await fs.readFile('cloth1.json', 'utf8');
    return JSON.parse(data);
};


// complete the code here
// จำนวนเสื้อผ้าตามที่กำหนด
const editJsonFile = (data) => {
    const n_stock = [12, 13, 50, 22, 55, 87, 12, 29, 10];
    data.forEach((item, index) => {
        item.stock = n_stock[index];
    });
    return data;
};


// complete the code here
const writeJsonFile = async (data) => {
    await fs.writeFile(
        'new_cloth.json',
        JSON.stringify(data, null, 2),
        'utf8'
    );
};


// complete the code here
const main = async () => {
    const data = await readJsonFile();
    const editedData = editJsonFile(data);
    await writeJsonFile(editedData);
    return editedData;
};


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});