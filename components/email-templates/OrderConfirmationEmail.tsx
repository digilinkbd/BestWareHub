import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Button,
  Hr,
  Img,
} from "@react-email/components";

interface OrderConfirmationEmailProps {
  order: {
    orderNumber: string;
    name: string;
    totalOrderAmount: number;
    shippingMethod: string;
    items: Array<{
      title: string;
      quantity: number;
      price: number;
      imageUrl: string;
    }>;
    shippingAddress: {
      address: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  order,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your order #{order.orderNumber} from BestWareHub</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with logo and order confirmation */}
          <Section style={headerSection}>
            <Row>
              <Column>
                <Heading style={h1}>BestWareHub</Heading>
              </Column>
            </Row>
            <Row>
              <Column>
                <Img
                  src="https://utfs.io/f/93a08641-2fd8-4e6c-998c-ed5fb68c4c74-hbhpsg.png"
                  width="128"
                  height="128"
                  alt="Order confirmation"
                  style={headerImage}
                />
              </Column>
            </Row>
          </Section>

          {/* Order confirmation message */}
          <Section style={content}>
            <Heading style={h2}>Your Order is Confirmed!</Heading>
            <Text style={paragraph}>
              Hi {order.name},
            </Text>
            <Text style={paragraph}>
              Thank you for shopping with us. We've received your order and are working on it now!
              Your order number is <span style={highlight}>{order.orderNumber}</span>.
            </Text>

            {/* Order summary box */}
            <Section style={orderSummaryBox}>
              <Heading style={h3}>Order Summary</Heading>
              <Hr style={divider} />
              
              {/* Order items */}
              {order.items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={imageColumn}>
                    <Img src={item.imageUrl} width="80" height="80" alt={item.title} style={productImage} />
                  </Column>
                  <Column style={detailsColumn}>
                    <Text style={itemTitle}>{item.title}</Text>
                    <Text style={itemDetails}>Qty: {item.quantity}</Text>
                    <Text style={itemPrice}>${item.price.toFixed(2)}</Text>
                  </Column>
                </Row>
              ))}
              
              <Hr style={divider} />
              
              {/* Order totals */}
              <Row>
                <Column align="left">
                  <Text style={summaryLabel}>Shipping ({order.shippingMethod}):</Text>
                </Column>
                <Column align="right">
                  <Text style={summaryValue}>
                    ${order.shippingMethod === "express" ? "25.00" : "0.00"}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column align="left">
                  <Text style={summaryLabelTotal}>Total:</Text>
                </Column>
                <Column align="right">
                  <Text style={summaryValueTotal}>${order.totalOrderAmount.toFixed(2)}</Text>
                </Column>
              </Row>
            </Section>

            

            {/* Track order button */}
            <Section style={buttonContainer}>
              <Button style={button} href={`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders/${order.orderNumber}`}>
                Track Your Order
              </Button>
            </Section>

            <Text style={paragraph}>
              If you have any questions about your order, please contact our customer service team.
            </Text>

            <Hr style={hr} />
            
            {/* Footer with social links */}
            <Section style={socialSection}>
              <Row>
                <Column align="center">
                  <Img
                    src="https://utfs.io/f/f18c5bd9-9261-4f6b-a89c-6f85b5bff3c1-h3c1qc.png"
                    width="32"
                    height="32"
                    alt="Instagram"
                    style={socialIcon}
                  />
                </Column>
                <Column align="center">
                  <Img
                    src="https://utfs.io/f/cdba5af4-4480-495a-8e9d-370f9c88cc01-4iim9w.png"
                    width="32"
                    height="32"
                    alt="Facebook"
                    style={socialIcon}
                  />
                </Column>
                <Column align="center">
                  <Img
                    src="https://utfs.io/f/5b2eb2b4-0e9d-4967-9aa4-7ce718b47317-2xt0xj.png"
                    width="32"
                    height="32"
                    alt="Twitter"
                    style={socialIcon}
                  />
                </Column>
              </Row>
            </Section>
            
            <Text style={footer}>
              &copy; {new Date().getFullYear()} BestWareHub. All rights reserved.<br />
              You're receiving this email because you made a purchase from BestWareHub.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
};

const headerSection = {
  backgroundColor: "#FFFBEB",
  padding: "30px 20px",
  textAlign: "center" as const,
};

const headerImage = {
  margin: "20px auto 0",
};

const h1 = {
  color: "#F59E0B",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
  textAlign: "center" as const,
  letterSpacing: "1px",
};

const content = {
  padding: "30px 20px",
};

const h2 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const h3 = {
  color: "#F59E0B",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const paragraph = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "16px 0",
};

const highlight = {
  color: "#F59E0B",
  fontWeight: "bold",
};

const orderSummaryBox = {
  backgroundColor: "#FFFBEB",
  padding: "20px",
  borderRadius: "6px",
  margin: "25px 0",
};

const addressBox = {
  backgroundColor: "#F9FAFB",
  padding: "20px",
  borderRadius: "6px",
  margin: "25px 0",
};

const addressText = {
  fontSize: "15px",
  lineHeight: "1.5",
  color: "#4B5563",
  margin: "0",
};

const divider = {
  borderTop: "1px solid #E5E7EB",
  margin: "15px 0",
};

const itemRow = {
  margin: "15px 0",
};

const imageColumn = {
  width: "80px",
  verticalAlign: "top",
};

const detailsColumn = {
  paddingLeft: "15px",
  verticalAlign: "top",
};

const productImage = {
  borderRadius: "4px",
  border: "1px solid #E5E7EB",
};

const itemTitle = {
  fontSize: "15px",
  fontWeight: "bold",
  margin: "0 0 5px",
  color: "#1F2937",
};

const itemDetails = {
  fontSize: "14px",
  color: "#6B7280",
  margin: "0 0 3px",
};

const itemPrice = {
  fontSize: "15px",
  fontWeight: "bold",
  color: "#F59E0B",
  margin: "5px 0 0",
};

const summaryLabel = {
  fontSize: "15px",
  color: "#6B7280",
  margin: "0",
  paddingRight: "10px",
};

const summaryValue = {
  fontSize: "15px",
  color: "#1F2937",
  margin: "0",
  textAlign: "right" as const,
};

const summaryLabelTotal = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1F2937",
  margin: "10px 0 0",
  paddingRight: "10px",
};

const summaryValueTotal = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#F59E0B",
  margin: "10px 0 0",
  textAlign: "right" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#F59E0B",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 30px",
  boxShadow: "0 2px 4px rgba(245, 158, 11, 0.3)",
};

const hr = {
  borderTop: "1px solid #E5E7EB",
  margin: "30px 0 25px",
};

const socialSection = {
  margin: "20px 0",
};

const socialIcon = {
  margin: "0 10px",
};

const footer = {
  color: "#6B7280",
  fontSize: "13px",
  textAlign: "center" as const,
  margin: "20px 0 0",
  lineHeight: "1.5",
};

export default OrderConfirmationEmail;