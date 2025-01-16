"use client";

import {
  SaleReceipt,
  Product,
  useCreateSalesReceiptMutation,
  useGetProductsQuery,
} from "@/state/api";
import Header from "../(components)/Header";
import { use, useState } from "react";
import {
  Banknote,
  CreditCard,
  Gift,
  Minus,
  Pencil,
  Plus,
  Trash,
  Trash2,
  Wallet,
} from "lucide-react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unitPrice?: number;
  totalAmount?: number;
  remark?: string;
};

const POS = () => {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [createSalesReceipt, { isSuccess }] = useCreateSalesReceiptMutation();
  const [cartTotal, setCartTotal] = useState(0);
  const [payment, setPayment] = useState<string>("Cash");
  const [editItem, setEditItem] = useState<string | null>();
  const [discount, setDiscount] = useState<number | null>(0);

  const quantityStyle =
    "w-5 h-5 p-0.5 text-slate-400 bg-zinc-100 rounded hover:bg-zinc-300 hover:text-slate:600 transition-all";

  // SET PAYMENT METHOD FOR THE RECEIPT
  const handlePayment = (
    event: React.MouseEvent<HTMLElement>,
    newPayment: string
  ) => {
    setPayment(newPayment);
  };

  // Recalculate Total Amount
  const updateTotalAmount = (tempCart: CartItem[]) => {
    const updatedCartTotal = tempCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setCartTotal(updatedCartTotal);
  };

  // ADD ITEM TO CART
  const handleAddToCart = (product: {
    productId: string;
    name: string;
    price: number;
    stockQuantity: number;
  }) => {
    setCart((prevCart) => {
      let newCart;
      // Check if the product already exists in the cart
      const existingProduct = prevCart.find(
        (item) => item.productId === product.productId
      );

      if (existingProduct) {
        // Increment the quantity of the existing product
        newCart = prevCart.map((item) =>
          // If Item click matched with productId in Cart & quantity is less than available total quantity
          item.productId === product.productId &&
          item.quantity < product.stockQuantity
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add the new product with a quantity of 1
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }

      updateTotalAmount(newCart);
      return newCart;
    });
  };

  // INCREASE ITEM QUANTITY IN CART
  const handleQtyIncrement = (item: CartItem) => {
    let newCart;

    setCart((prevCart) => {
      newCart = prevCart.map((cartItem) =>
        cartItem.productId === item.productId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );

      updateTotalAmount(newCart);
      return newCart;
    });
  };

  // INCREASE ITEM QUANTITY IN CART
  const handleQtyDecrement = (item: CartItem) => {
    let newCart;

    setCart((prevCart) => {
      newCart = prevCart.map((cartItem) =>
        cartItem.productId === item.productId && cartItem.quantity != 1
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );

      updateTotalAmount(newCart);
      return newCart;
    });
  };

  const removeCartItem = (item: CartItem) => {
    const newCart = cart.filter(
      (cartItem) => cartItem.productId !== item.productId
    );
    updateTotalAmount(newCart);
    setCart(newCart);
  };

  // HIDE / SHOW EDIT FIELDS
  const editMode = (productId: string) => {
    setEditItem((prev) => (prev === productId ? null : productId));
  };

  // SET DISCOUNT
  const applyDiscount = (item: CartItem, value: number | null) => {
    let newCart;
    setCart((prevCart) => {
      newCart = prevCart.map((cartItem) =>
        cartItem.productId === item.productId
          ? {
              ...cartItem,
              price: cartItem.price * (1 - (value === null ? 0 : value) / 100),
            }
          : cartItem
      );

      updateTotalAmount(newCart);
      return newCart;
    });
  };

  // SET REMARK FOR CART ITEM
  const setRemark = (item: CartItem, value: string) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.productId === item.productId
          ? { ...cartItem, remark: value }
          : cartItem
      )
    );
  };

  // CHECKOUT ITEMS IN CART INTO SALES & SALES RECEIPT
  const handleCheckout = async () => {
    // Check if Cart is Empty
    if (cart.length === 0) {
      console.log("Empty");
      return;
    }

    // Get TotalAmount
    // const sum = total.reduce((previousValue, currentValue, index) => previousValue + currentValue, 0);
    // cart.reduce() access the cart's array values.
    // total = previous value; item = current value; accumulator value is 0.
    const totalAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const checkoutData: SaleReceipt = {
      cart: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unitPrice: item.price,
        totalAmount: item.price * item.quantity,
        remark: item.remark,
      })),
      totalAmount,
      remark: payment,
    };

    try {
      await createSalesReceipt(checkoutData);
      handleClearCart();
      if (isSuccess) {
        console.log("Checkout successful!");
      }
    } catch (error) {
      console.log("Checkout failed:", error);
    }
  };

  const handleClearCart = () => {
    setCart([]);
    setCartTotal(0);
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Point of Sale"></Header>
      </div>

      {/* BODY PRODUCT LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] h-full gap-10">
        {/* Product List */}
        <div className="grid grid-cols-2 grid-rows-2 gap-6 lg:grid-cols-4 justify-between">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            products?.map((product) => (
              <div
                key={product.productId}
                className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
              >
                <div className="flex flex-col">
                  <div className="w-full h-48 bg-slate-200 rounded mb-2"></div>
                  <h3 className="text-lg text-gray-900 font-semibold">
                    {product.name}
                  </h3>
                  <p className="text-gray-800">RM {product.price.toFixed(2)}</p>
                  <div className="text-sm text-gray-600 mt-1">
                    Stock: {product.stockQuantity}
                  </div>
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-gray-700"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Cart */}
        <div className="flex flex-col justify-between p-6 bg-white shadow h-screen fixed bottom-0 right-0 w-1/4 min-w-96 overflow-scroll">
          {/* TOP */}
          <div className="flex flex-col gap-4 pb-4">
            <div className="flex flex-row justify-between items-center mb-2">
              <h3 className="text-xl font-medium text-gray-900 ">
                Order Details
              </h3>
              {cart.length > 0 ? (
                <button
                  className="bg-zinc-100 px-4 py-1 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-zinc-200 transition-all"
                  onClick={handleClearCart}
                >
                  Clear
                </button>
              ) : (
                ""
              )}
            </div>

            {/* ITEMS */}
            <div>
              {cart.length === 0 ? (
                <p className="border-t pt-4">It's quite empty now</p>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} className="border-t pb-4 pt-4">
                    <div className="flex flex-row gap-6 items-center">
                      {/* IMAGE */}
                      <div className="h-20 aspect-square bg-slate-200 rounded"></div>
                      {/* NAME & PRICE */}
                      <div className="w-full flex gap-1 flex-col">
                        <p className="text-lg font-medium">{item.name}</p>
                        <p className=" text-sm text-blue-700">
                          RM {(item.quantity * item.price).toFixed(2)}
                        </p>
                        {/* QUANTITY */}
                        <div className="flex flex-row gap-3">
                          <button onClick={() => handleQtyDecrement(item)}>
                            <Minus className={quantityStyle}></Minus>
                          </button>
                          <p className="text-lg">{item.quantity}</p>
                          <button onClick={() => handleQtyIncrement(item)}>
                            <Plus className={quantityStyle}></Plus>
                          </button>
                        </div>
                      </div>
                      {/* EDIT */}
                      <div>
                        <button onClick={() => editMode(item.productId)}>
                          <Pencil className="w-4 h-4 text-gray-400"></Pencil>
                        </button>
                      </div>
                    </div>
                    {/* EDIT FIELDS */}
                    {editItem === item.productId && (
                      <div>
                        <div className="mt-4 flex flex-row items-center gap-2">
                          <input
                            type="textarea"
                            name="remark"
                            value={item.remark || ""}
                            placeholder="Additional Notes"
                            onChange={(e) => setRemark(item, e.target.value)}
                            className="block w-full p-2 border rounded-md"
                          ></input>
                          <button
                            className="p-1 bg-blue-500 text-white rounded h-full"
                            onClick={(e) => {
                              applyDiscount(item, 100);
                            }}
                          >
                            <Gift className="p-1 text-slate-100"></Gift>
                          </button>
                          <button
                            className="p-1 bg-gray-400 text-white rounded h-full hover:bg-red-400 transition-all"
                            onClick={() => removeCartItem(item)}
                          >
                            <Trash2 className="p-1 text-slate-100"></Trash2>
                          </button>
                          {/* <input
                            type="number"
                            name="discount"
                            placeholder="Discount (%)"
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              setDiscount(isNaN(value) ? null : value);
                            }}
                            className="block w-full p-2 border rounded-md"
                          ></input>
                          <button
                            type="button"
                            value="0"
                            onClick={() => applyDiscount(item, discount)}
                            className="w-fit px-4 py-2 bg-blue-500 text-white rounded hover:bg-gray-700"
                          >
                            Apply
                          </button> */}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          {/* BOTTOM */}
          <div className="flex flex-col ">
            <p className="text-2xl font-medium text-end border-t border-blue-500 text-blue-500 py-3">
              Total: RM {cartTotal.toFixed(2)}
            </p>
            <ToggleButtonGroup
              value={payment}
              exclusive
              color="primary"
              onChange={handlePayment}
              aria-label="payment"
              className="mt-2"
            >
              <ToggleButton
                value="Cash"
                aria-label="cash"
                className="flex- flex-col w-full gap-1"
              >
                <Banknote />
                Cash
              </ToggleButton>
              <ToggleButton
                value="E-Wallet"
                aria-label="e-wallet"
                className="flex- flex-col w-full gap-1"
              >
                <Wallet />
                E-Wallet
              </ToggleButton>
              <ToggleButton
                value="Bank"
                aria-label="bank"
                className="flex- flex-col w-full gap-1"
              >
                <CreditCard />
                Bank
              </ToggleButton>
            </ToggleButtonGroup>
            <button
              type="button"
              className="mt-4 px-4 py-4  text-white bg-blue-500 rounded text-lg font-medium"
              onClick={handleCheckout}
            >
              Complete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
