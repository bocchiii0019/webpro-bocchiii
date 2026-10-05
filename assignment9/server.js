const fs = require('fs/promises');
const http = require('http');

const hostname = 'localhost';
const port = 3000;

// สร้าง HTTP Server
const server = http.createServer(async (req, res) => {
    try {
        // อ่าน แก้ไข และเขียนข้อมูล
        const data = await main();

        // แสดงผลบน browser
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });

        res.write(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
        res.end();

    } catch (error) {
        res.writeHead(500, {
            'Content-Type': 'text/plain; charset=utf-8'
        });

        res.end(`Error: ${error.message}`);
    }
});


// อ่าน cloth1.json
const readJsonFile = async () => {
    const data = await fs.readFile('cloth1.json', 'utf8');

    return JSON.parse(data);
};


// จำนวนเสื้อผ้าตามที่กำหนด
const editJsonFile = (data) => {

    const n_stock = [12, 13, 50, 22, 55, 87, 12, 29, 10];

    data.forEach((item, index) => {
        item.stock = n_stock[index];
    });

    return data;
};


// เขียนข้อมูลลง new_cloth.json
const writeJsonFile = async (data) => {

    await fs.writeFile(
        'new_cloth.json',
        JSON.stringify(data, null, 2),
        'utf8'
    );
};


// ทำงานตามลำดับ
const main = async () => {

    const data = await readJsonFile();

    const editedData = editJsonFile(data);

    await writeJsonFile(editedData);

    return editedData;
};


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});