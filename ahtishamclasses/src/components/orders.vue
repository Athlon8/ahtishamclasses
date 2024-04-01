<template>
  <!-- The div below will be displayed when the order is placed -->
  <div v-if="orderedChoice">
    <div
      style="
        width: 95%;
        height: fit-content;
        padding: 2%;
        background-color: antiquewhite;
        border-radius: 4%;
        margin-top: 2%;
      "
    >
      <h1 style="text-align: center">Order Information</h1>
      <p>
        <strong>First Name: </strong>
        <span> {{ order.firstName }}</span>
      </p>
      <p>
        <strong>Last Name: </strong>
        <span> {{ order.lastName }}</span>
      </p>
      <p>
        <strong>Number: </strong>
        <span> {{ order.number }}</span>
      </p>
      <p>
        <strong>Products: </strong>
        <span> {{ order.productsString }}</span>
      </p>
      <h1 style="text-align: center">Your order has been confirmed</h1>
      <div style="text-align: center">
        <button
          style="
            background-color: rgb(2, 117, 216);
            border-radius: 20%;
            cursor: pointer;
            color: white;
            font-size: large;
            padding: 2%;
          "
          v-on:click="backToStarting"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
  <div v-else style="padding: 2%">
    <h1 style="text-align: center">Cart</h1>
    <!-- The div below is for displaying the products in the cart with their spaces -->
    <div style="display: flex; flex-wrap: wrap">
      <div
        v-for="product in cart"
        style="
          width: 17%;
          padding: 2%;
          background-color: aliceblue;
          border-radius: 2%;
          margin: 2%;
        "
        :key="product.id"
      >
        <figure>
          <img v-bind:src="product.image" height="100px" width="100px" />
        </figure>
        <h2 v-text="product.title"></h2>
        <p v-html="product.description"></p>
        <p>Location: {{ product.location }}</p>
        <p>Spaces: {{ cartCount(product.id) }}</p>
        <p>Price: {{ product.price }} Per Course</p>
        <span>
          <button
            v-on:click="removeOne(product.id)"
            style="
              border-radius: 20%;
              background-color: rgb(223, 53, 69);
              color: white;
              cursor: pointer;
            "
          >
            Remove One
          </button>
        </span>
        <span style="border-radius: 4%">
          <button
            v-on:click="removeAll(product.id)"
            style="
              border-radius: 20%;
              background-color: rgb(223, 53, 69);
              color: white;
              cursor: pointer;
            "
          >
            Remove All
          </button>
        </span>
        <span v-for="n in parseInt(product.rating)" :key="`filled_${n}`"
          >★</span
        >
        <!-- Empty Stars -->
        <span v-for="n in 5 - parseInt(product.rating)" :key="`empty_${n}`"
          >☆</span
        >
      </div>
    </div>
    <!-- The div below is to collect the required order information from the user -->
    <div
      style="
        width: 95%;
        height: fit-content;
        padding: 2%;
        background-color: antiquewhite;
        border-radius: 4%;
        margin-top: 2%;
      "
    >
      <h1 style="text-align: center">Order Information</h1>
      <p>
        <strong>First Name: </strong>
        <input v-model="order.firstName" type="text" />
      </p>
      <p>
        <strong>Last Name: </strong>
        <input v-model="order.lastName" type="text" />
      </p>
      <p>
        <strong>Number: </strong>
        <input v-model="order.number" type="number" />
      </p>
      <div style="text-align: center">
        <button
          style="
            background-color: rgb(2, 117, 216);
            border-radius: 20%;
            cursor: pointer;
            color: white;
            font-size: large;
            padding: 2%;
          "
          v-on:click="checkout"
          v-if="cartItemCount > 0 && checkNameAndPhone"
        >
          Checkout
        </button>
        <button
          disabled="disabled"
          v-else
          style="
            background-color: rgb(223, 53, 69);
            border-radius: 20%;
            color: white;
            font-size: large;
            padding: 2%;
          "
        >
          Checkout
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "cartList",
  props: ["fullCart", "cart", "cartArray", "orderedChoice"],
  data() {
    return {
      order: {
        firstName: "",
        lastName: "",
        number: "",
        productsString: "",
      },
      ordered: false,
    };
  },
  created: function () {},
  methods: {
    cartCount(id) {
      console.log(this.cart);
      let count = 0;
      for (let i = 0; i < this.cartArray.length; i++) {
        if (this.cartArray[i] === id) {
          count++;
        }
      }
      return count;
    },
    removeOne(id) {
      this.$emit("removeSingle", id);
    },
    removeAll(id) {
      this.$emit("removeFull", id);
    },
    checkout() {
      this.$emit("orderedState");
      for (let i = 0; i < this.cart.length; i++) {
        // productInformation[this.cartProducts[i]._id] = this.cartProducts[i].availableInventory - this.cartCount(this.cartProducts[i].id);
        if (i === this.cart.length - 1) {
          this.order.productsString +=
            this.cart[i].title + " x " + this.cartCount(this.cart[i].id);
        } else {
          this.order.productsString +=
            this.cart[i].title + " x " + this.cartCount(this.cart[i].id) + ", ";
        }
      }
    },
    // The method below is after the order is successfull
    backToStarting() {
      this.$emit("emptyCart");
      this.order.firstName = "";
      this.order.lastName = "";
      this.order.number = "";
      this.$emit("orderedState");
      this.$emit("showCheckout");
      // location.reload();
    },
  },

  computed: {
    cartItemCount: function () {
      return this.cart.length || "";
    },
    checkNameAndPhone() {
      return (
        /^[A-Za-z\s]+$/.test(this.order.firstName) &&
        /^[A-Za-z\s]+$/.test(this.order.lastName) &&
        /^[0-9]+$/.test(this.order.number)
      );
    },
  },
};
</script>
<style>
</style>
