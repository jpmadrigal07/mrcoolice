import React, { useState } from "react";
import Navigation from "../../components/Navigation/Navigation";
import { Nav } from "rsuite";
import ProductList from "../../components/Product/ProductList";
import AddProduct from "../../components/Product/AddProduct";
import { useLocation } from "react-router-dom";

const Product = () => {
  const { search } = useLocation();
  const currentTab = search.replace("?tab=", "");
  const [activeTab, setActiveTab] = useState(
    currentTab !== "" ? currentTab : "productList"
  );

  const renderTabs = () => {
    if (activeTab === "addProduct") {
      return (
        <>
          <AddProduct />
        </>
      );
    } else if (activeTab === "productList") {
      return (
        <>
          <ProductList />
        </>
      );
    }
  };
  return (
    <div>
      <Navigation currentPage={"product"} />

      <Nav
        appearance="subtle"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
      >
        <Nav.Item eventKey="productList">Product List</Nav.Item>
        <Nav.Item eventKey="addProduct">Add Product</Nav.Item>
      </Nav>

      {renderTabs()}
    </div>
  );
};

export default Product;
