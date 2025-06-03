import { useState, useRef, useEffect } from 'react';
import styles from '../styles/Chatbot.module.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const messagesEndRef = useRef(null);

  // Predefined questions and answers (tree structure)
  const questionTree = {
    "General Questions": {
      "How do I upload a car?": `
        To upload a car for rental:
        1. Navigate to 'Your Cars' section in your dashboard
        2. Click the 'Upload a Vehicle' button
        3. Fill in all required details including:
           - Vehicle make, model, and year
           - Registration number
           - Photos (minimum 3, maximum 10)
           - Rental price per day
           - Available dates
        4. Specify any special requirements or rules
        5. Submit the form
        
        Your listing will be reviewed within 24 hours. You'll receive a notification once approved.
      `,
      "How do I edit my car details?": `
        To edit your car details:
        1. Go to 'Your Cars' section
        2. Find the vehicle you want to edit
        3. Click the 'Edit' button
        4. Make your changes to any field:
           - You can update photos, pricing, availability
           - Change vehicle description or features
        5. Click 'Save Changes'
        
        Note: Major changes (like vehicle type) may require re-approval.
      `,
      "What payment methods are accepted?": `
        We accept the following payment methods:
        
        - Credit Cards: Visa, MasterCard, American Express
        - Debit Cards: All major banks
        - Bank Transfers: Direct transfers to our verified account
        - Digital Wallets: Apple Pay, Google Pay
        
        Payments are processed securely through our PCI-DSS compliant payment gateway. All transactions are encrypted.
      `,
      "What are the insurance requirements?": `
        Insurance requirements for listed vehicles:
        
        - All vehicles must have valid comprehensive insurance
        - Minimum coverage of $50,000 for third-party liability
        - Rental period must be covered by your policy
        - You must upload proof of insurance when listing
        
        We provide supplemental insurance during rental periods at no extra cost to owners.
      `
    },
    "Booking Issues": {
      "My booking was declined": `
        If your booking was declined, possible reasons include:
        
        1. Vehicle unavailable for requested dates
        2. Owner has specific requirements not met
        3. Payment verification needed
        4. Account needs verification
        
        Action steps:
        - Check your messages for specific reasons
        - Modify your request if possible
        - Contact support if you need clarification
      `,
      "I need to cancel a booking": `
        Cancellation process:
        
        For Renters:
        1. Go to 'My Bookings'
        2. Select the booking to cancel
        3. Click 'Request Cancellation'
        4. Select reason and submit
        
        Cancellation policies:
        - >7 days before: Full refund
        - 2-7 days before: 50% refund
        - <48 hours: No refund
        
        For Owners:
        Contact support immediately if you need to cancel a confirmed booking.
      `,
      "The car wasn't as described": `
        If the vehicle doesn't match its listing:
        
        1. Document the issues with photos/video
        2. Contact us immediately via:
           - In-app support chat
           - Emergency hotline: +1 (555) 123-4567
        
        We will:
        - Investigate the discrepancy
        - Help arrange alternative transportation if needed
        - Process refunds if warranted
        - Take action against misleading listings
      `,
      "I'm having trouble extending my rental": `
        To extend your rental:
        
        1. Go to 'My Bookings'
        2. Select the active rental
        3. Click 'Request Extension'
        4. Enter new end date/time
        5. Submit request
        
        The owner has 12 hours to respond. If approved:
        - You'll be charged the prorated rate
        - New rental agreement will be generated
        
        If the owner doesn't respond, contact support for assistance.
      `
    },
    "Account Settings": {
      "How do I change my password?": `
        Password change process:
        
        1. Go to your Profile
        2. Select 'Security Settings'
        3. Click 'Change Password'
        4. Enter:
           - Current password
           - New password (minimum 8 characters)
           - Confirm new password
        5. Click 'Update Password'
        
        Security requirements:
        - Must contain uppercase, lowercase, and number
        - Cannot be same as last 3 passwords
        - You'll be logged out of all devices after change
      `,
      "How do I update my email?": `
        Email address changes:
        
        For security reasons, email changes require verification:
        
        1. Contact our support team
        2. Provide:
           - Current email verification
           - Government-issued ID
           - Reason for change
        3. You'll receive confirmation at both emails
        4. Click verification link in new email
        
        This process helps prevent unauthorized account changes.
      `,
      "How do I delete my account?": `
        Account deletion process:
        
        1. Contact support via 'Help Center'
        2. Request account deletion
        3. Provide reason (optional)
        4. Verify your identity
        
        Important notes:
        - Active rentals must be completed first
        - Pending payments will be processed
        - Data is anonymized after 30 days
        - Cannot be undone once completed
      `,
      "How do I update my payment methods?": `
        Updating payment information:
        
        1. Go to 'Account Settings'
        2. Select 'Payment Methods'
        3. Choose to:
           - Add new payment method
           - Remove existing method
           - Set default payment
        
        Security features:
        - All payment details are encrypted
        - We never store full card numbers
        - Changes require password verification
      `
    },
    "Safety & Support": {
      "What safety measures are in place?": `
        Our safety protocols include:
        
        For Renters:
        - Verified owner profiles
        - Vehicle condition reports
        - 24/7 roadside assistance
        - Trip tracking (optional)
        
        For Owners:
        - Renter ID verification
        - Security deposit holds
        - Damage protection
        - Fraud monitoring
        
        All rentals include $1M liability coverage.
      `,
      "What if I have an accident?": `
        In case of accident:
        
        1. Ensure everyone is safe
        2. Contact local authorities if needed
        3. Call our emergency line: +1 (555) 987-6543
        4. Document the scene with photos
        5. Complete incident report in app
        
        We will:
        - Coordinate with insurance
        - Arrange replacement vehicle if needed
        - Handle all claims processing
      `,
      "How does roadside assistance work?": `
        Our roadside assistance covers:
        
        - Battery jump-starts
        - Flat tire changes
        - Lockout service
        - Fuel delivery
        - Towing to nearest repair facility
        
        To request assistance:
        1. Open the app
        2. Go to 'Active Rental'
        3. Tap 'Roadside Assistance'
        4. Select service needed
        
        Available 24/7 in all service areas.
      `,
      "How do I contact customer support?": `
        Support options:
        
        In-App:
        1. Go to 'Help Center'
        2. Select 'Contact Support'
        3. Choose category and describe issue
        
        Phone Support:
        - General inquiries: +1 (555) 123-4567
        - Emergency line: +1 (555) 987-6543
        
        Hours:
        - Mon-Fri: 6AM-9PM (local time)
        - Sat-Sun: 8AM-8PM
        - Emergencies: 24/7
      `
    },
    "Pricing & Fees": {
      "How are rental prices determined?": `
        Pricing factors:
        
        - Vehicle make/model/year
        - Local market rates
        - Rental duration
        - Seasonality
        - Owner-set preferences
        
        Our platform suggests competitive pricing, but owners set final rates. You'll always see the total price with all fees before booking.
      `,
      "What fees should I expect?": `
        Potential fees include:
        
        - Base rental rate
        - Service fee (10-15% of rental)
        - Optional insurance upgrades
        - Cleaning fee (if vehicle returned dirty)
        - Late return fees (1.5x hourly rate)
        - Fuel recharge (if returned with less than received)
        
        All fees are disclosed before booking confirmation.
      `,
      "How do I get the best deals?": `
        Tips for best prices:
        
        1. Book early (especially for peak seasons)
        2. Consider longer rentals (weekly discounts)
        3. Look for 'Instant Book' vehicles
        4. Check for owner promotions
        5. Use our 'Deals' section
        
        Sign up for price alerts on specific vehicle types.
      `,
      "When will I receive my owner payments?": `
        Payment schedule for owners:
        
        - Payments are released 24 hours after rental ends
        - Processing takes 1-3 business days
        - First payment may take additional verification
        
        You can track payments in 'Earnings' section. Minimum payout is $25. We support direct deposit and PayPal.
      `
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setMessages([{ text: "Hello! How can I help you today?", sender: "bot" }]);
    }
  };

  const handleQuestionSelect = (category, question) => {
    const answer = questionTree[category][question];
    setMessages([
      ...messages,
      { text: question, sender: "user" },
      { text: answer, sender: "bot" }
    ]);
    setSelectedQuestion(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.chatbotContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>Help Center</h3>
            <button onClick={toggleChat} className={styles.closeButton}>×</button>
          </div>
          
          <div className={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.questionsSection}>
            {!selectedQuestion ? (
              Object.keys(questionTree).map((category) => (
                <div key={category} className={styles.questionCategory}>
                  <h4>{category}</h4>
                  {Object.keys(questionTree[category]).map((question) => (
                    <button
                      key={question}
                      className={styles.questionButton}
                      onClick={() => handleQuestionSelect(category, question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <div className={styles.questionDetails}>
                <button 
                  className={styles.backButton}
                  onClick={() => setSelectedQuestion(null)}
                >
                  ← Back to categories
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button onClick={toggleChat} className={styles.chatToggleButton}>
        {isOpen ? '×' : '💬'}
      </button>
    </div>
  );
};

export default Chatbot;