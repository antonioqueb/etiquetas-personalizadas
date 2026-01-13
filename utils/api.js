export async function fetchFolios() {
  try {
    const response = await fetch("/api/recepciones", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error en la API: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Folios recibidos:", data);
    return data;
  } catch (error) {
    console.error("Error obteniendo los folios:", error);
    return [];
  }
}

export async function fetchProductDetails(folio) {
  try {
    // ⚠️ Codificar el folio para evitar problemas con '/'
    const encodedFolio = encodeURIComponent(folio);

    const response = await fetch(`/api/recepciones/${encodedFolio}/productos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error en la API: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`Detalles del producto para ${folio}:`, data);
    return data;
  } catch (error) {
    console.error(`Error obteniendo detalles del producto para ${folio}:`, error);
    return [];
  }
}
