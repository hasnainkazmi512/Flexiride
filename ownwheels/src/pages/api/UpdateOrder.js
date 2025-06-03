import connectDB from "../../../middleware/mongo";
import MakeOrder from "../../../models/MakeOrder";
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        const authHeader = req.headers['auth-token'];
        const userType =  req.headers["user-type"];

        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }

        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(authHeader, secretKey);
        const userID = decoded.UserID;
        
       
        const temporder = MakeOrder.findOne({_id:req.body.orderID})

        try {
            let order
            if (userType == 1 )
            {
                const { orderID, StartDate, EndDate, Status, type,money_status,order_type } = req.body;
                order = await MakeOrder.findOneAndUpdate(
                    { _id: orderID,userID:temporder.userID }, 
                    { StartDate, EndDate, Status, type,money_status,order_type }, 
                    { new: true }
                );
            }
            else if (userType == 2){
                temporder.order_type = 2;
                order = await MakeOrder.findOneAndUpdate(
                    { _id: temporder._id, userID: userID }, 
                    { order_type: 2 }, // Update order_type in the database
                    { new: true }
                );
            }
            else{
                const { orderID, StartDate, EndDate, Status, type,money_status,order_type } = req.body;
                order = await MakeOrder.findOneAndUpdate(
                    { _id: orderID, userID: userID }, 
                    { StartDate, EndDate, Status, type,money_status,order_type }, 
                    { new: true }
                );
            }

            if (!order) {
                return res.status(404).json({ message: 'Order not found or you are not authorized to update this order' });
            }

            res.status(200).json({ success: true, order });
        } catch (error) {
            res.status(500).json({ error: 'Server error occurred while updating the order' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default connectDB(handler);
