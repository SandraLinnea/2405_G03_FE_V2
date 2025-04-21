let shoppingCart = JSON.parse(localStorage.getItem("Products")) || [];
const cartContainer = document.querySelector("#shoppingCartContent");

function displayOrderSummaryTable() {
    if (!cartContainer) {
        console.error("Shopping cart container (#shoppingCartContent) not found.");
        return;
    }

    cartContainer.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = "Varukorg";
    heading.style.marginBottom = "1rem";
    cartContainer.appendChild(heading);

    
    if (shoppingCart && shoppingCart.length > 0) {
        const groupedCart = shoppingCart.reduce((acc, product) => {
            const key = product?._id;
            if (!key) {
                console.warn("Skipping product in cart summary due to missing _id:", product);
                return acc;
            }
            if (!acc[key]) {
                if (product && typeof product.price === 'number') {
                    acc[key] = { ...product, quantity: 1 };
                } else {
                    console.warn("Skipping product in cart summary due to missing price:", product);
                }
            } else {
                acc[key].quantity += 1;
            }
            return acc;
        }, {});
        const cartItems = Object.values(groupedCart);


        const table = document.createElement("table");
        table.className = "cart-table";


        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        const headers = ["Produkt", "Antal", "á", "Totalt"];
        headers.forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            if (["Antal", "á", "Totalt"].includes(text)) {
                th.style.textAlign = "right";
            }
            headerRow.appendChild(th);
        });

        const tbody = table.createTBody();
        let overallTotal = 0;
        cartItems.forEach(item => {
            const price = typeof item.price === 'number' ? item.price : 0;
            const itemTotal = price * item.quantity;
            overallTotal += itemTotal;
            const row = tbody.insertRow();
            row.insertCell().textContent = item.title || 'Okänd Produkt';
            const cellQuantity = row.insertCell();
            cellQuantity.textContent = item.quantity;
            cellQuantity.style.textAlign = "right";
            const cellPrice = row.insertCell();
            cellPrice.textContent = `${price.toFixed(2)} kr`;
            cellPrice.style.textAlign = "right";
            const cellTotal = row.insertCell();
            cellTotal.textContent = `${itemTotal.toFixed(2)} kr`;
            cellTotal.style.textAlign = "right";
        });

        const tfoot = table.createTFoot();
        const footerRow = tfoot.insertRow();
        const cellTotalLabel = footerRow.insertCell();
        cellTotalLabel.textContent = "Summa:";
        cellTotalLabel.colSpan = 3;
        cellTotalLabel.style.fontWeight = 'bold';
        cellTotalLabel.style.textAlign = 'right';
        const cellTotalValue = footerRow.insertCell();
        cellTotalValue.textContent = `${overallTotal.toFixed(2)} kr`;
        cellTotalValue.style.fontWeight = 'bold';
        cellTotalValue.style.textAlign = 'right';
        cartContainer.appendChild(table);

    } else {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = `Varukorgen är tom. Gå tillbaka till butiken för att lägga till produkter.`;
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.marginTop = '1rem';
        cartContainer.appendChild(emptyMessage);
        const submitButton = document.getElementById('submit');
         if(submitButton) {
             submitButton.disabled = true;
             submitButton.style.opacity = 0.5;
             submitButton.style.cursor = 'not-allowed';
         } else {
             console.warn("Submit button with id='submit' not found for disabling.");
         }
    }
}

displayOrderSummaryTable();


let orderItems = [];
if (shoppingCart && shoppingCart.length > 0) {
    const processedProductIds = new Set();

    shoppingCart.forEach((product) => {
        if (!product._id || processedProductIds.has(product._id)) {
            return;
        }

        let productQuantity = 0;
        shoppingCart.forEach((productList) => {
            if (productList._id === product._id) {
                productQuantity++;
            }
        });

        let item = {
            productId: product._id,
            quantity: productQuantity,
        };
        orderItems.push(item);
        processedProductIds.add(product._id);
    });
}
console.log("Original OrderItems for submission:", orderItems); 


const userSessionStorageData = JSON.parse(sessionStorage.getItem("user"));
if (userSessionStorageData) {

    if (userSessionStorageData.firstName) { 
         document.getElementById("firstname").value = userSessionStorageData.firstName;
    }
    if (userSessionStorageData.email) { 
        document.getElementById("email").value = userSessionStorageData.email;
    }
    
}
const formElem = document.querySelector("form");

if (formElem) {
  formElem.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!orderItems || orderItems.length === 0) {
        alert("Din varukorg är tom. Lägg till produkter innan du beställer.");
        return;
    }

    const formData = new FormData(formElem);


    const userData = {
      email: formData.get("email"),
      firstname: formData.get("firstname"), 
      lastname: formData.get("lastname"),
      phonenumber: formData.get("phonenumber").replace(/\D/g, ""),
      shippingAddress: { // 
        street: formData.get("street"),
        number: formData.get("number"),
        zipCode: formData.get("zipCode"),
        city: formData.get("city"),
      },
      orderItem: orderItems, 
    };

    console.log("Submitting Original Structure Data:", userData); 

    const apiUrl = "https://grupp-3.vercel.app/api/orders/"; 

    axios.post(apiUrl, userData)
      .then((response) => {
        console.log("Order Response:", response.data);
        alert("Tack för din beställning! Din order är mottagen.");
        localStorage.removeItem("Products");
        formElem.reset();
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(
          "Order Submission Error:",
          error.response ? error.response.data : error.message
        );
        alert(
          "Ett fel inträffade vid beställningen. Försök igen eller kontakta support.\n" +
           (error.response ? `Fel: ${JSON.stringify(error.response.data)}` : error.message)
        );
      });
  });
} else {
    console.error("Form element not found on the page.");
}