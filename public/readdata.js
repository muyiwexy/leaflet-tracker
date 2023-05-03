plotmarker();
// setInterval(plotmarker, 1000)

async function getData(){
    const mainlat = [];
    const mainlong = [];
    const mainid = [];

    const response = await fetch('data/test.csv')
    const data = await response.text();

    const table = data.split('\n').slice(1);
    table.forEach(row => {
        const columns = row.split(',');
        const id = columns[0];
        mainid.push(id)
        const lat = columns[1];
        mainlat.push(parseFloat(lat));
        const long = columns[2];
        mainlong.push(parseFloat(long));
        console.log(id, lat, long);
    });
    return {mainid, mainlat, mainlong};
}
