//FUNCION QUE SE EJECUTA CUANDO SE CARGA EL DOM
$(document).ready(function () {
    if("CARRITO" in localStorage){
        const arrayLiterales = JSON.parse(localStorage.getItem("CARRITO"));
        if(arrayLiterales.length > 0){
            for (const literal of arrayLiterales) {
                carrito.push(new Producto(literal.id, literal.nombre, literal.precio, literal.cantidad));
            }
          
            carritoUI(carrito);
        }
    }
    $(".dropdown-menu").click(function (e) { 
        e.stopPropagation();
    });

    $.get('../data/producto.json',function(datos, estado){
        console.log(datos);
        console.log(estado);
        if(estado == 'success'){
            for (const literal of datos) {
                productos.push(new Producto(literal.id, literal.nombre, literal.precio, literal.categoria, literal.cantidad, literal.imagen));
            }
        }
        
        console.log(productos);

        productosUI(productos, '#productosContenedor');
    });
});

window.addEventListener('load',()=>{
    $('#indicadorCarga').remove();
    $('#productosContenedor').fadeIn("slow");
})

//DEFINIR EVENTOS SOMBRE EL INPUT DE FILTRO DE PRECIO
$(".inputPrecio").change(function (e) { 
    const min = $("#minProducto").val();
    const max = $("#maxProducto").val();
    if((min > 0) && (max > 0)){
                                                 //el resulado de esto es verdadero
        const encontrados = productos.filter(p => p.precio >= min && p.precio <= max);
        productosUI(encontrados, '#productosContenedor');
    }
});


