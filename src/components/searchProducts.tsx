import axios from 'axios';

async function searchProducts(searchTerm: any) {
  try {
    const response = await axios.get(`https://localhost:44373/ProductSearch?keyword=${searchTerm}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default searchProducts;