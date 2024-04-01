<template>
  <div style="width: 100%; margin: 2%; display: flex; flex-wrap: wrap">
    <!-- The div below would check if the user has searched anything or not and if the user has not then it will
                            be displayed and it would get the products list from sortedProducts -->
    <div
      v-for="product in products"
      style="
        width: 15%;
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
      <p>Location: {{ product.Location }}</p>
      <p>Price: {{ product.price }}</p>
      <p>
        Available Inventory
        {{ product.availableInventory - cartCount(product.id) }}
      </p>
      <button
        v-on:click="addCart(product)"
        v-if="canAddToCart(product)"
        style="
          background-color: rgb(2, 117, 216);
          border-radius: 20%;
          cursor: pointer;
          color: white;
        "
      >
        Add to cart
      </button>
      <button
        disabled="disabled"
        v-else
        style="
          background-color: rgb(223, 53, 69);
          border-radius: 20%;
          color: white;
        "
      >
        Add to cart
      </button>
      <span v-if="product.availableInventory === cartCount(product.id)"
        >All out!</span
      >
      <span v-else-if="product.availableInventory - cartCount(product.id) < 5"
        >Only
        {{ product.availableInventory - cartCount(product.id) }} left!</span
      >
      <span v-else>Buy now!</span>
      <!-- Filled Stars -->
      <span v-for="n in parseInt(product.rating)" :key="`filled_${n}`">★</span>
      <!-- Empty Stars -->
      <span v-for="n in 5 - parseInt(product.rating)" :key="`empty_${n}`"
        >☆</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductList",
  props: ["products", "cart", "cartArray"],
  data() {
    return {};
  },
  created: function () {},
  methods: {
    addCart(product) {
      this.$emit("addProduct", product);
    },
    canAddToCart(product) {
      return product.availableInventory > this.cartCount(product.id);
    },
    // The method below returns the cartCount of a specifc product by its id
    cartCount(id) {
      let count = 0;
      for (let i = 0; i < this.cartArray.length; i++) {
        if (this.cartArray[i] === id) {
          count++;
        }
      }
      return count;
    },
  },
};
</script>
<style>
</style>