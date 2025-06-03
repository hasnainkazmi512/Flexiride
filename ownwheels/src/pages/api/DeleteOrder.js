import connectDB from "../../../middleware/mongo";
import MakeOrder from "../../../models/MakeOrder";
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
    if (req.method === 'DELETE') {
        const authHeader = req.headers['auth-token'];
        const userType = req.headers["user-type"];

        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }

        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(authHeader, secretKey);
        const userID = decoded.UserID;
        
        const { orderID } = req.body;
        
        try {
            let order
            if (userType == 1){
                temporder = MakeOrder.findOne({_id:orderID})
                order = await MakeOrder.findOneAndDelete({ _id: orderID, userID: temporder.userID });
            }
            else{
                order = await MakeOrder.findOneAndDelete({ _id: orderID, userID: userID });
            }

            if (!order) {
                return res.status(404).json({ message: 'Order not found or you are not authorized to delete this order' });
            }

            res.status(200).json({ success: true, message: 'Order deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Server error occurred while deleting the order' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default connectDB(handler);
