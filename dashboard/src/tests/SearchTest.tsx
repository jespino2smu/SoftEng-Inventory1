import React, { useState, useEffect } from "react";
import { SearchTestComponent, type Item } from "./SearchTestComponent";
import { Button, Box } from "@mui/material";

import { post } from '../components/api';

export const SearchTest: React.FC = () => {
    
    const [products, setProducts] = useState<Item[]>([]);
//   const [items, setItems] = useState<Item[]>([
//     { ProductId: 1, ProductName: "Apple Pie",},
//     { ProductId: 2, ProductName: "Banana Bread"},
//     { ProductId: 3, ProductName: "Cherry Tart"},
//     { ProductId: 4, ProductName: "Blueberry Muffin"},
//   ]);


  useEffect(() => {
    updateData();
  }, []);

  async function updateData() {
    const response = await post('/stocks/get-products', {
        activity: 'Inventory',
    });

    //alert(response[0][0].Quantity);

    // Object.keys(response[0][0]).forEach(
    //   function(k) {
    //     alert(k + ' - ' + response[0][k]);
    // });



    // response[0].forEach(
    //   (item: Product) => index.add(item)
    // );

    // response[0].forEach((item: { ProductId: any; ProductName: string; })  => {
    //   index.add({
    //     id: item.ProductId,
    //     name: item.ProductName.toLowerCase(), // normalize to lowercase
    //   });
    // });

    setProducts(response[0]);
  }

  const addNewItem = () => {
    const newId = products.length + 1;
    const newItem: Item = {
      ProductId: newId,
      ProductName: `New Item ${newId}`
    };
    setProducts((prev) => [...prev, newItem]);
  };

  return (
    <Box sx={{ width: 300, p: 2 }}>
      <SearchTestComponent data={products} />
      <Box mt={2}>
        <Button variant="contained" onClick={addNewItem}>
          Add Item
        </Button>
      </Box>
    </Box>
  );
};