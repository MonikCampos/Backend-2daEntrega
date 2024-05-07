const socket = io();

socket.on('Products', products => {
    //console.log(products);
    const tbody = document.getElementById("productsBody");
    tbody.innerHTML = '';

    products.forEach(element => {
        const  tr = tbody.insertRow();
        tr.innerHTML = `
        <td>${element._id}</td>
        <td>${element.id}</td>
        <td>${element.title}</td>
        <td>${element.description}</td>
        <td>${element.price}</td>
        <td>${element.code}</td>
        <td>${element.status}</td>
        <td>${element.stock}</td>
        <td>${element.category}</td>
        <td>${element.brand}</td>
        <td>${element.thumbnail==undefined ? 'Without image' : element.thumbnail[0]}</td>
        `;
    });
});

const form = document.getElementById( "productForm" );
form.addEventListener( "submit", function ( event ) {
    event.preventDefault();
    //Captar  los datos del formulario
    const id = document.getElementById('id').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const code=document.getElementById('code').value;   
    const status = document.getElementById('status').value;    
    const stock = document.getElementById('stock').value;  
    const category = document.getElementById('category').value;
    const brand = document.getElementById('brand').value;
    
    //Enviar el producto a travez de web socket
    const producto = {
        id,
        title,
        description,
        price,
        code,
        status,
        stock,
        category,
        brand
    }
    socket.emit('nuevoProducto', producto);
    form.reset();
});