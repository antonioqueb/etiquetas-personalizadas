export async function fetchFolios() {
    const response = await fetch("http://192.168.1.78:5000/recepciones");
    return response.json();
  }
  
  export async function fetchProductDetails(folio) {
    const response = await fetch(`http://192.168.1.78:5000/recepciones/${folio}/productos`);
    return response.json();
  }
  