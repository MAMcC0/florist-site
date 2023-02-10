const { NavItem } = require('react-bootstrap');
const Product = require('../models/product');


const stateTax = {
    stateCode: 'CA',
    stateName: 'California',
    rate: 0.08
};

exports.calculateSalesTax = order => {
    try {
        const salesTax = stateTax.rate;

        order.totalTax = 0;

        if(order.products > 0){
            order.products.map(product => {
                const productPrice = product.price;
                const quantity = product.quantity;

                product.totalPrice = productPrice * quantity;

                if(order.status !== 'Cancelled'){
                    const productTax = productPrice * salesTax * 100;
                    product.totalTax = parseFloat(
                        Number((productTax * quantity).toFixed(2))
                    );

                    order.tax += product.totalTax;
                }

                product.totalPrice = parseFloate(
                    Number((product.totalPrice + product.totalTax).toFixed(2))
                );
            });
        }

        order.total = this.orderTotal(order);
        order.totalTax = parseFloat(
            Number(order.totalTax.toFixed(2));
        )
        order.totalWithTax = parseFloat(Number(order.totalWithTax.toFixed(2)));
        return order;
    } catch (error) {
        return order;

    }
}