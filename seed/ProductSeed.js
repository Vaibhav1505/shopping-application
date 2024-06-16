var Product = require("../models/product.model");
var mongoose = require("mongoose");

async function createProducts() {
    mongoose
        .connect("mongodb://0.0.0.0:27017/Shopping_Appliacation")
        .then(() => {
            console.log("Database Connected");
        })
        .catch((err) => {
            console.log("Error in connecting to Database" + err);
        });

    const products = [
        new Product({
            imagePath: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1716504320",
            title: "CSGO",
            description: "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2.",
            price: 30,
        }),
        new Product({
            imagePath: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/header.jpg?t=1717109067",
            title: "Forza Horizon",
            description: "Lorem ipsum dolorsit amet consectetur adipisicing elit.Obcaecati aliquid culpa temporibus iste.Natus quos autem saepe!Ab,maxime explicabo eum similique iusto odio iure.Tenetur quae officia nihil in !",
            price: 6555,
        }),
        new Product({
            imagePath: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1029690/header.jpg?t=1698833632",
            title: "Sniper Elite",
            description: "This Game may contain content not appropriate for all ages, or may not be appropriate for viewing at work: Frequent Violence or Gore, General Mature Content",
            price: 3225,
        }),
    ];

    var doneSaving = 0;

    for (var i = 0; i < products.length; i++) {
        const savedProduct = await products[i].save();
        console.log(savedProduct);
        doneSaving++;
        if (doneSaving === products.length) {
            exit();
            console.log("Data insertion Successfull");
        }
    }
}

function exit() {
    mongoose.disconnect();
}
// createProducts();