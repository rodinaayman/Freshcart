export function formatePrice(price: number) {
return new Intl. NumberFormat("en-US", {
currency: "EGP",
style: "currency",

}).format(price);

}
