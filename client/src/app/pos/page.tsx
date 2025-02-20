"use client";

import {
  SaleReceipt,
  useCreateSalesReceiptMutation,
  useGetProductsQuery,
  useGetCollectionQuery,
} from "@/state/api";
import { ChangeEvent, useState } from "react";
import {
  Banknote,
  CreditCard,
  Gift,
  Minus,
  Pencil,
  Plus,
  Ticket,
  Trash2,
  Wallet,
} from "lucide-react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Image from "next/image";

type CartItem = {
  productId: string;
  productImage: string;
  name: string;
  price: number;
  quantity: number;
  unitPrice?: number;
  totalAmount?: number;
  remark?: string;
};

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [createSalesReceipt] = useCreateSalesReceiptMutation();
  const [cartTotal, setCartTotal] = useState(0);
  const [payment, setPayment] = useState<string>("Cash");
  const [receiptRemark, setReceiptRemark] = useState<string>("");
  const [editItem, setEditItem] = useState<string | null>();
  const [discount, setDiscount] = useState<number | null>();
  const [cartDiscount, setCartDiscount] = useState<number | null>();
  const [searchCollection, setSearchCollection] = useState<number>();
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery({ collectionQuery: searchCollection });
  const { data: collections } = useGetCollectionQuery();

  // HANDLE COLLECTION CHANGE
  const handleCollectionChange = (newValue: number) => {
    if (newValue == 0 || newValue == 1) {
      setSearchCollection(undefined);
    } else {
      setSearchCollection(newValue);
    }
  };

  // SET PAYMENT METHOD FOR THE RECEIPT
  const handlePayment = (
    event: React.MouseEvent<HTMLElement>,
    newPayment: string
  ) => {
    setPayment(newPayment);
  };

  // SET REMARK FOR RECEIPT
  const handleReceiptRemarkChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReceiptRemark(e.target.value);
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
    productImage: string;
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

  // REMOVE ITEM FROM CART
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

  // SET DISCOUNT BY SPECIFIC AMOUNT
  const applyDiscountByAmount = (
    item: CartItem,
    value: number | null | undefined
  ) => {
    let newCart;
    setCart((prevCart) => {
      newCart = prevCart.map((cartItem) =>
        cartItem.productId === item.productId
          ? {
              ...cartItem,
              price:
                value === null || value === undefined
                  ? cartItem.price
                  : value >= cartItem.price
                  ? 0
                  : cartItem.price - value,
            }
          : cartItem
      );

      updateTotalAmount(newCart);
      return newCart;
    });
  };

  // SET DISCOUNT BY SPECIFIC AMOUNT
  const applyDiscountToCart = (value: number | null | undefined) => {
    value === null || value === undefined ? (value = 0) : value;
    setCartTotal(cartTotal - value);
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
      total: cartTotal,
      remark:
        payment +
        " | " +
        receiptRemark +
        " | " +
        `Cart Discount: RM ${cartDiscount}`,
    };

    try {
      await createSalesReceipt(checkoutData);
      handleClearCart();
      alert("Order successfully created.");
    } catch (error) {
      console.log("Checkout failed:", error);
    }
  };

  const handleClearCart = () => {
    setCart([]);
    setCartTotal(0);
  };

  // CSS STYLE
  const quantityStyle =
    "w-5 h-5 p-0.5 text-slate-400 bg-zinc-100 rounded hover:bg-zinc-300 hover:text-slate:600 transition-all";
  const tabStyle = "bg-blue-500 text-white font-semibold rounded-lg";

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
      {/* BODY PRODUCT LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-[60vw_2fr] xl:grid-cols-[65vw_2fr] gap-4">
        <div className="w-full h-90vh overflow-scroll">
          {/* TAB */}
          <div className="flex gap-2 mb-2 bg-white p-2 rounded-md border border-gray-200 overflow-scroll sticky top-0">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              collections?.map((collection) => (
                <button
                  key={collection.collectionId}
                  onClick={() =>
                    handleCollectionChange(collection.collectionId)
                  }
                  // Default Style
                  className={`px-4 py-2 rounded-lg min-w-fit transition-all ${
                    // Active Style
                    searchCollection == collection.collectionId
                      ? `${tabStyle}`
                      : collection.name === "None" && searchCollection == null
                      ? `${tabStyle}`
                      : `hover:bg-gray-200`
                  }`}
                >
                  {collection.name == "None" ? "All" : collection.name}
                </button>
              ))
            )}
          </div>
          {/* Product List */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              products?.map((product) => (
                <button
                  key={product.productId}
                  className="bg-white border border-gray-200 rounded-md p-3 w-full h-fit"
                  onClick={() => handleAddToCart(product)}
                >
                  <div className="flex flex-col items-start">
                    {product.productImage == null ||
                    product.productImage == "" ||
                    product.productImage == undefined ? (
                      <div className="w-full h-36 rounded-md mb-2  bg-slate-200"></div>
                    ) : (
                      <Image
                        src={product.productImage}
                        alt={`${product.name}'s Image`}
                        width={512}
                        height={512}
                        style={{ width: "100%", objectFit: "cover" }}
                        className="w-full h-36 rounded-md mb-2"
                      ></Image>
                    )}

                    <h3 className="text-lg text-gray-900 font-semibold">
                      {product.name}
                    </h3>
                    <p className="text-gray-500">
                      RM {product.price.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
        {/* Cart */}
        <div className="flex flex-col border-8 border-white justify-between bg-white shadow rounded-2xl h-90vh lg:sticky lg:top-4 overflow-scroll">
          {/* TOP */}
          <div className="flex flex-col gap-4 p-4 pb-2">
            <div className="flex flex-row justify-between items-center">
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
                <p className="border-t pt-4">Cart is Empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} className="border-t py-4">
                    <div className="flex flex-row gap-6 items-center">
                      {/* IMAGE */}
                      {item.productImage == null ||
                      item.productImage == "" ||
                      item.productImage == undefined ? (
                        <div className="h-20 aspect-square bg-slate-200 rounded"></div>
                      ) : (
                        <Image
                          src={item.productImage}
                          alt={`${item.name}'s Image`}
                          width={256}
                          height={256}
                          style={{ objectFit: "cover" }}
                          className="w-20 aspect-square rounded object-cover"
                        ></Image>
                      )}

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
                        <div className="mt-4 flex flex-row items-center gap-2 flex-wrap">
                          <input
                            type="textarea"
                            name="remark"
                            value={item.remark || ""}
                            placeholder="Note: Add some remark"
                            onChange={(e) => setRemark(item, e.target.value)}
                            className="block w-full p-2 border rounded-md"
                          ></input>
                          {/* SET DISCOUNT BY AMOUNT */}
                          <input
                            type="number"
                            name="discount"
                            placeholder="Discount Amount"
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              setDiscount(isNaN(value) ? null : value);
                            }}
                            className="flex-1 p-2 border rounded-md"
                          ></input>
                          <button
                            type="button"
                            value="0"
                            onClick={() =>
                              applyDiscountByAmount(item, discount)
                            }
                            className="w-fit px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-all"
                          >
                            APPLY
                          </button>
                          {/* FREE GIFT (DISCOUNT ITEM BY 100%) */}
                          <button
                            className="flex items-center p-1 pr-3 bg-blue-600 text-white rounded h-full hover:bg-blue-700 transition-all"
                            onClick={() => {
                              applyDiscount(item, 100);
                            }}
                          >
                            <Gift className="p-1 text-slate-100"></Gift>{" "}
                            FREEBIES
                          </button>
                          {/* REMOVE ITEM */}
                          <button
                            className="p-1 bg-red-400 text-white rounded h-full hover:bg-red-500 transition-all"
                            onClick={() => removeCartItem(item)}
                          >
                            <Trash2 className="p-1"></Trash2>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          {/* BOTTOM */}
          <div className="flex flex-col p-4 bg-gray-50 rounded-2xl sticky bottom-0">
            <div className="flex flex-row justify-between items-center mb-2"></div>
            <input
              type="textarea"
              name="receiptRemark"
              placeholder="Additional Notes"
              className="block w-full p-2 border rounded-md mb-2"
              onChange={handleReceiptRemarkChange}
            ></input>
            <div className="flex flex-row justify-between">
              <div className="flex gap-1">
                <input
                  type="number"
                  name="cartDiscount"
                  placeholder="Discount"
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setCartDiscount(isNaN(value) ? null : value);
                  }}
                  className="w-32 p-2 border rounded-md"
                ></input>
                <button
                  type="button"
                  value="0"
                  className="w-fit p-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:text-white transition-all"
                  onClick={() => applyDiscountToCart(cartDiscount)}
                >
                  <Ticket className="w-6 h-6" />
                </button>
              </div>
              <p className="text-2xl font-medium text-end mb-2">
                RM {cartTotal.toFixed(2)}
              </p>
            </div>

            <ToggleButtonGroup
              value={payment}
              exclusive
              color="primary"
              onChange={handlePayment}
              aria-label="payment"
              className="mt-2 border-gray-200"
            >
              <ToggleButton
                value="Cash"
                aria-label="cash"
                className="flex- flex-col w-full gap-1"
              >
                <Banknote />
              </ToggleButton>
              <ToggleButton
                value="E-Wallet"
                aria-label="e-wallet"
                className="flex- flex-col w-full gap-1"
              >
                <Wallet />
              </ToggleButton>
              <ToggleButton
                value="Bank"
                aria-label="bank"
                className="flex- flex-col w-full gap-1"
              >
                <CreditCard />
              </ToggleButton>
            </ToggleButtonGroup>
            <button
              type="button"
              className="mt-4 py-2 text-white bg-blue-600 rounded text-lg font-medium hover:bg-blue-700 transition-all"
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
