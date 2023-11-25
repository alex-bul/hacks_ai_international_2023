let DOWNLOAD_LINK = null;
let DOWNLOAD_FILE = null;

document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let videoInput = document.getElementById('videoInput');
      let videos = videoInput.files;

      let jsonInput = document.getElementById('jsonInput');
      let jsonFiles = jsonInput.files;
      document.getElementById('car').classList.remove('d-none');
      let formData = new FormData();
      for (let i = 0; i < videos.length; i++) {
        formData.append('videos', videos[i]);
      }
      for (let i = 0; i < jsonFiles.length; i++) {
        formData.append('jsonFiles', jsonFiles[i]);
      }

      fetch('/upload', {
        method: 'POST',
        body: formData
      })
    .then(response => response.json())
    .then(function (data) {
        let filename = data.filename;
        let resultBlock = document.getElementById('tableContent');
        if(data.length){
            for(let item of data){
                let cardHTML = `
                            <tr >

                    <td>${item["file_name"]}</td>
                    <td>${item["car"]}</td>
                    <td>${item["quantity_car"]}</td>
                    <td>${item["average_speed_car"]}</td>
                    <td>${item["van"]}</td>
                    <td>${item["quantity_van"]}</td>
                    <td>${item["average_speed_van"]}</td>
                    <td>${item["bus"]}</td>
                    <td>${item["quantity_bus"]}</td>
                    <td>${item["average_speed_bus"]}</td>
                                </tr >

                  `;

                resultBlock.innerHTML += cardHTML;
            }
            document.getElementById('car').classList.add('d-none');
            document.getElementById('result_table').classList.remove('d-none');

            DOWNLOAD_FILE = filename
            DOWNLOAD_LINK = "/download?filename=" + filename
        }
        else {
            document.getElementById('no_violation').classList.remove('d-none');
        }

    })
    .catch(function (error) {
        console.error('Error:', error);
        document.getElementById('loader').classList.add('d-none');
    });

    videoInput.value = '';
});

function downloadFile() {
    let table = document.getElementById('result_table');

    let tableData = [];
    for (let i = 0; i < table.rows.length; i++) {
      let row = table.rows[i];
      let rowData = [];

      for (let j = 0; j < row.cells.length; j++) {
        let cell = row.cells[j];

        rowData.push(cell.innerHTML);
      }
      tableData.push(rowData);
    }
    console.log(tableData);
    fetch('/download', {
        method: 'POST',
        body: JSON.stringify(tableData),
  headers: {
    'Content-Type': 'application/json'
  }
      }).then(response => response.blob())
  .then((blob) => {
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'result.csv'; // Set the desired filename here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  })
}
