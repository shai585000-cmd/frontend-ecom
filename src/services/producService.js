import apInstance from "./api"

export const getProducts = async () => {
    const response = await api.get("/products");
    return response.data;
  };

export const getProductDetails = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};
