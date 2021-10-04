
function productosUI(productos, id){
  $(id).empty();
  for (const producto of productos) {
     $(id).append(`<div class="card" style="width: 11rem;">
                    <img src="${producto.imagen}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h6 class="card-title">${producto.nombre}</h6>
                      <p class="card-text">${producto.precio}</p>
                      <a href="#" id='${producto.id}' class="btn btn-primary btn-compra">COMPRAR</a>
                    </div>
                  </div>`);
  }
  $('.btn-compra').on("click", comprarProducto);
}

function comprarProducto(e){
  
  e.preventDefault();
  e.stopPropagation();
 
  const idProducto   = e.target.id;
  const seleccionado = carrito.find(p => p.id == idProducto);
  //SI NO SE ENCONTRO BUSCAR EN ARRAY DE PRODUCTOS
  if(seleccionado == undefined){
    carrito.push(productos.find(p => p.id == idProducto));
  }else{
  
    seleccionado.agregarCantidad(1);
  }
 

  localStorage.setItem("CARRITO",JSON.stringify(carrito));
  carritoUI(carrito);
}

function carritoUI(productos){
  $('#carritoCantidad').html(productos.length);
  $('#carritoProductos').empty();
  for (const producto of productos) {
    $('#carritoProductos').append(registroCarrito(producto));
  }

  $('#carritoProductos').append(`<p id="totalCarrito"> TOTAL ${totalCarrito(productos)}</p>`);

  $('#carritoProductos').append('<div id="divConfirmar" class="text-center"><button id="btnConfimar" class="btn btn-success">CONFIRMAR</button></div>')

  
  $('.btn-delete').on('click', eliminarCarrito);
  $('.btn-add').click(addCantidad);
  $('.btn-sub').click(subCantidad);
  $('#btnConfimar').click(confirmarCompra);
}

function registroCarrito(producto){
  return `<p class="ml-2"> ${producto.nombre} 
          <span class="badge badge-warning">$ ${producto.precio}</span>
          <span class="badge badge-dark">${producto.cantidad}</span>
          <span class="badge badge-success"> $ ${producto.subtotal()}</span>
          <img src="../assets/img/logofooter.jpg" alt="footerlogo" class="rounded-circle body__navmargen">
          <a id="${producto.id}" class="btn btn-info    btn-add">Agregar</a>
          <a id="${producto.id}" class="btn btn-warning btn-sub">Quitar</a>
          <a id="${producto.id}" class="btn btn-danger  btn-delete">Eliminar</a>
          </p>`
}

function eliminarCarrito(e){
  console.log(e.target.id);

  let posicion = carrito.findIndex(p => p.id == e.target.id);
  carrito.splice(posicion, 1);
  carritoUI(carrito);
  localStorage.setItem("CARRITO",JSON.stringify(carrito));
}

function addCantidad(){
  let producto = carrito.find(p => p.id == this.id);
  producto.agregarCantidad(1);
  $(this).parent().children()[1].innerHTML = producto.cantidad;
  $(this).parent().children()[2].innerHTML = producto.subtotal();

  $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
  localStorage.setItem("CARRITO",JSON.stringify(carrito));
}

function subCantidad(){
  let producto = carrito.find(p => p.id == this.id);
  if(producto.cantidad > 1){
    producto.agregarCantidad(-1);
  
    let registroUI = $(this).parent().children();
    registroUI[1].innerHTML = producto.cantidad;
    registroUI[2].innerHTML = producto.subtotal();

    $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
    localStorage.setItem("CARRITO",JSON.stringify(carrito));
  }
}

function selectUI(lista, selector){

  $(selector).empty();

  lista.forEach(element => {
      $(selector).append(`<option value='${element}'>${element}</option>`);
  });
  $(selector).prepend(`<option value='TODOS' selected>TODOS</option>`);
}


function totalCarrito(carrito){
  console.log(carrito);
  let total = 0;
  carrito.forEach(p => total += p.subtotal());
  return total.toFixed(2);
}

function confirmarCompra(){

  $('#btnConfimar').hide();
  
  console.log("ENVIAR AL BACKEND");

  const URLPOST = 'https://jsonplaceholder.typicode.com/posts';
  
  const DATA   = {productos: JSON.stringify(carrito), total: totalCarrito(carrito)}
  
  $.post(URLPOST, DATA,function(respuesta,estado){
  
      if(estado == 'success'){

        $("#notificaciones").html(`<div class="alert alert-sucess alert-dismissible fade show" role="alert">
                    <strong>COMPRA CONFIRMADA!</strong> Comprobante Nº ${respuesta.id}.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    </div>`).fadeIn().delay(2000).fadeOut('');

        carrito.splice(0, carrito.length);

        localStorage.setItem("CARRITO",'[]');

        $('#carritoProductos').empty();

        $('#carritoCantidad').html(0);
      }
  });
}

