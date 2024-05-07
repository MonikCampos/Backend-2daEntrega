const addToCart=async(pid)=>{
    let idCart=document.getElementById("carrito")
    let cid=idCart.value
    
    let respuesta=await fetch(`/api/carts/${cid}/product/${pid}`,{
        method:"post"
    })
    if(respuesta.status===200){
        let datos=await respuesta.json()
        console.log(datos)
        alert(`Added product: ${pid} to Cart: ${cid}`)
    }
}