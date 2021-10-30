import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import axios from "axios";
import { useQuery } from "react-query";
import { GRAPHQL_ENDPOINT } from "../../services/constants";

const EditProduct = (props) => {
  const { isEditActive, setIsEditActive, productId } = props;
  const [product, setProduct] = useState({});

  const getToUpdateProduct = useQuery("getToUpdateProduct", async () => {
    const query = `{
            product(_id: "${productId}") {
                _id,
                iceType,
                weight,
                scaleType,
                cost
            }
          }`;
    return await axios.post(GRAPHQL_ENDPOINT, { query });
  });

  useEffect(() => {
    if (getToUpdateProduct.isSuccess) {
      if (
        !getToUpdateProduct.data.data?.errors &&
        getToUpdateProduct.data.data?.data?.product
      ) {
        setProduct(getToUpdateProduct.data.data?.data?.product);
      }
    }
  }, [getToUpdateProduct]);
  return (
    <div>
      <ProductForm
        isEditActive={isEditActive}
        setIsEditActive={setIsEditActive}
        toUpdateProduct={product}
      />
    </div>
  );
};

export default EditProduct;
