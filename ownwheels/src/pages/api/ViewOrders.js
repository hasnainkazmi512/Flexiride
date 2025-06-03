import connectDB from "../../../middleware/mongo";
import MakeOrder from "../../../models/MakeOrder";
import Deals from "../../../models/Deals";
import CustomizeQuotation from "../../../models/CustomizeQuotation";
import Rent from "../../../models/Rent";
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        const authHeader = req.headers['auth-token'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }

        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(authHeader, secretKey);
        const userID = decoded.UserID;

        try {
            const orders = await MakeOrder.find({ userID: userID });
            let products = []
            for (let order of orders) {
                const PID = order.productID;
                let product;
            
                if (order.type == 1) {
                    product = await Rent.findOne({ _id: PID });
                    //console.log(product)
                    console.log("Type 1: Rent product");
                } else if (order.type == 2) {
                    product = await Deals.findOne({ _id: PID });
                    console.log("Type 2: Deals product");
                } else if (order.type == 3) {
                    product = await CustomizeQuotation.findOne({ _id: PID });
                    console.log("Type 3: Customize Quotation product");
                }
            
                if (product) {
                    products.push({
                        order: order, // You can include order details alongside the product
                        product: product
                    });
                } else {
                    console.log(`Product not found for order with ID: ${order._id}`);
                }
            }
            console.log(products)
            if (orders.length === 0) {
                return res.status(404).json({ message: 'No orders found for this user' });
            }

            res.status(200).json({ success: true, products });
        } catch (error) {
            res.status(500).json({ error: 'Server error occurred while fetching the orders' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default connectDB(handler);
